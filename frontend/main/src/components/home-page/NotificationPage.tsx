import { HubConnectionBuilder } from '@microsoft/signalr'
import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const NotificationPage = () => {

    const [ like, setLike ] = useState<string>()

    useEffect(() => {
        const subscribeToNotifications = async () => {
            try {
                const token = localStorage.getItem('token')
                console.log(token)
                const conn = new HubConnectionBuilder()
                                 .withUrl('https://localhost:7208/Notification')
                                 .build()
    
                await conn.on('newMessage', message => {
                    setLike(message)
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
    }, [])

    return (
        <div>
            <Typography> {like} </Typography>
        </div>
    )
}

export default NotificationPage