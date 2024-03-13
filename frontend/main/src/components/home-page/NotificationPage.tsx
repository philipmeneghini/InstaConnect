import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const NotificationPage = () => {

    const [ connection, setConnection ] = useState<HubConnection>()
    const [ like, setLike ] = useState<string[]>([])

    useEffect(() => {
        const subscribeToNotifications = async () => {
            try {
                const conn = new HubConnectionBuilder()
                                 .withUrl("https://localhost:7208/Notification")
                                 .build()
    
                await conn.on('newMessage', (user: string, type: string) => {
                    setLike(prevState => {
                        prevState.push(type)
                        return prevState
                    })
                    console.log(like)
                })
                await conn.start()
                setConnection(conn)
            }
            catch{
                console.log("error!")
            }
        }

        subscribeToNotifications()
    }, [])

    return (
        <div>
            {like.map(l => <Typography> {l} </Typography>
                )}
        </div>
    )
}

export default NotificationPage