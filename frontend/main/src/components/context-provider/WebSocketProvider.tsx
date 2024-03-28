import { HubConnectionBuilder } from '@microsoft/signalr'
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { UserContext } from './UserProvider'
import { NotificationModel } from '../../api/Client'
import { _apiClient } from '../../App'
import { NotificationContext } from './NotificationProvider'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'

interface WebSocketProviderProps {
    children: React.ReactNode
  }
  
export const WebSocketContext = createContext<{notifications: NotificationModel[],
                                               unReadNotifications: number, 
                                               setNotificationOpen: React.Dispatch<React.SetStateAction<NotificationModel | undefined>>
                                               deleteNotification: (notification: NotificationModel) => void
                                               readNotification: (notification: NotificationModel) => void}>({
        notifications: [],
        unReadNotifications: 0,
        setNotificationOpen: () => {},
        deleteNotification: () => {},
        readNotification: () => {}
    })

const WebSocketProvider = (props: WebSocketProviderProps) => {
    const [ notifications, setNotifications ] = useState<NotificationModel[]>([])
    const [ notificationOpen, setNotificationOpen ] = useState<NotificationModel>()
    const { user, token } = useContext(UserContext)
    const { openNotification } = useContext(NotificationContext) 
    const unReadNotifications = useMemo(() => {
        let readCount: number = 0
        notifications.forEach(n => {
            if (!n.read) {
                readCount ++
            }
        })
        return readCount
    }, [notifications])

    useEffect(() => {
        const subscribeToNotifications = async () => {
            try {
                getNotifications()
                const conn = new HubConnectionBuilder()
                                 .withUrl('https://localhost:7208/NotificationHub')
                                 .build()
    
                await conn.on('newMessage', notification => {
                    getNotifications()
                })
                await conn.start().then(() => {
                    conn.invoke('GetConnectionId', token).then((identifier) => {
                        console.log(identifier)
                    })
                })
            }
            catch{
                console.log('error!')
            }
        }
        const getNotifications = async() => {
            try {
                const pastNotifications = await _apiClient.notificationsGET(user?.email)
                setNotifications(pastNotifications)
            }
            catch(err: any) {
                if (err.statusCode !== 404) {
                    openNotification(false, 'Failed to load notifications! ' + err.message)
                }
            }
        }

        if (token && user) {
            subscribeToNotifications()
        }
    }, [user, token])

    const deleteNotification = async (notification : NotificationModel) => {
        setNotificationOpen(undefined)
        let newNotifications = notifications
        try {
            const ind = newNotifications.indexOf(notification)
            if (ind !== -1) {
                await _apiClient.notificationDELETE(notification.id)
                newNotifications.splice(ind, 1) 
            }
            setNotifications(newNotifications)
            openNotification(true, 'Successfully Deleted Notification')
        }
        catch(err: any) {
            openNotification(false, `Error Deleting Notification!: ${err.message}`)
        }
    }

    const readNotification = async (notification : NotificationModel) => {
        if (notification.read) {
            return
        }
        let newNotifications = notifications
        try {
            const ind = newNotifications.indexOf(notification)
            let newNotification = notification
            newNotification.read = true
            if (ind !== -1) {
                await _apiClient.notificationPUT(newNotification)
                newNotifications[ind] = newNotification 
            }
            setNotifications(newNotifications)
        }
        catch(err: any) {
            openNotification(false, `Error Modifying Notification!: ${err.message}`)
        }
    }

    const handleNotificationClose = () => {
        setNotificationOpen(undefined)
    }

    return (
        <WebSocketContext.Provider value={{notifications, unReadNotifications, setNotificationOpen, deleteNotification, readNotification}}>
            { props.children }
            <Dialog
            open={notificationOpen !== undefined}
            onClose={handleNotificationClose}
            >
                <DialogContent>
                    <DialogContentText>
                        {notificationOpen?.body}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNotificationClose}> Close </Button>
                </DialogActions>
            </Dialog>
        </WebSocketContext.Provider>
    )
}    

export default WebSocketProvider    