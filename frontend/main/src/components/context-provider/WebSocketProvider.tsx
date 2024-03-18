import { HubConnectionBuilder } from '@microsoft/signalr'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from './UserProvider'

interface WebSocketProviderProps {
    children: React.ReactNode
  }
  
export const WebSocketContext = createContext<{notifications: string[]}>({
        notifications: []
    })

const WebSocketProvider = (props: WebSocketProviderProps) => {
    const [ notifications, setNotifications ] = useState<string[]>([])
    const { token } = useContext(UserContext)

    useEffect(() => {
        const subscribeToNotifications = async () => {
            try {
                console.log(token)
                const conn = new HubConnectionBuilder()
                                 .withUrl('https://localhost:7208/Notification')
                                 .build()
    
                await conn.on('newMessage', message => {
                    addNotification(message)
                    console.log(message)
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

        subscribeToNotifications()
    }, [token])

    const addNotification = (message: string) => {
        let newNotifications: string[] = [...notifications]
        newNotifications.push(message)
        setNotifications(newNotifications)
    }

    return (
        <WebSocketContext.Provider value={{notifications}}>
            { props.children }
        </WebSocketContext.Provider>
    )
}    

export default WebSocketProvider    