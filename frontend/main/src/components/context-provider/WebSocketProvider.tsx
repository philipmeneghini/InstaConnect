import { HubConnectionBuilder } from '@microsoft/signalr'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from './UserProvider'
import { NotificationModel } from '../../api/Client'
import { _apiClient } from '../../App'

interface WebSocketProviderProps {
    children: React.ReactNode
  }
  
export const WebSocketContext = createContext<{notifications: NotificationModel[]}>({
        notifications: []
    })

const WebSocketProvider = (props: WebSocketProviderProps) => {
    const [ notifications, setNotifications ] = useState<NotificationModel[]>([])
    const { user, token } = useContext(UserContext)

    useEffect(() => {
        const subscribeToNotifications = async () => {
            try {
                console.log(token)
                const conn = new HubConnectionBuilder()
                                 .withUrl('https://localhost:7208/NotificationHub')
                                 .build()
    
                await conn.on('newMessage', notification => {
                    addNotification(notification)
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
        const GetNotifications = async () => {
            console.log(user?.email)
            const pastNotifications = await _apiClient.notificationsGET(user?.email)
            setNotifications(pastNotifications)
        }

        if (token && user) {
            GetNotifications()
            subscribeToNotifications()
        }
    }, [user, token])

    const addNotification = (newNotification: NotificationModel) => {
        let resultingNotifications: NotificationModel[] = [...notifications]
        resultingNotifications.push(newNotification)
        setNotifications(resultingNotifications)
    }

    return (
        <WebSocketContext.Provider value={{notifications}}>
            { props.children }
        </WebSocketContext.Provider>
    )
}    

export default WebSocketProvider    