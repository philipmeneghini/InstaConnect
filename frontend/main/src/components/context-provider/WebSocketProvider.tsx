import { HubConnectionBuilder } from '@microsoft/signalr'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from './UserProvider'
import { NotificationModel } from '../../api/Client'
import { _apiClient } from '../../App'
import { NotificationContext } from './NotificationProvider'

interface WebSocketProviderProps {
    children: React.ReactNode
  }
  
export const WebSocketContext = createContext<{notifications: NotificationModel[], 
                                               deleteNotification: (notification: NotificationModel) => void}>({
        notifications: [],
        deleteNotification: () => {}
    })

const WebSocketProvider = (props: WebSocketProviderProps) => {
    const [ notifications, setNotifications ] = useState<NotificationModel[]>([])
    const { user, token } = useContext(UserContext)
    const { openNotification } = useContext(NotificationContext) 

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
                openNotification(false, 'Failed to load notifications! ' + err.message)
            }
        }

        if (token && user) {
            subscribeToNotifications()
        }
    }, [user, token])

    const deleteNotification = (notification : NotificationModel) => {
        let newNotifications = notifications
        try {
            const ind = newNotifications.indexOf(notification)
            if (ind !== -1) {
                _apiClient.notificationDELETE(notification.id)
                newNotifications.splice(ind) 
            }
            setNotifications(newNotifications)
            openNotification(true, 'Successfully Deleted Notification')
        }
        catch(err: any) {
            openNotification(false, `Error Deleting Notification!: ${err.message}`)
        }
    }

    return (
        <WebSocketContext.Provider value={{notifications, deleteNotification}}>
            { props.children }
        </WebSocketContext.Provider>
    )
}    

export default WebSocketProvider    