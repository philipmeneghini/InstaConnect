import { useContext, useState } from 'react'
import { WebSocketContext } from '../context-provider/WebSocketProvider'
import { Badge, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import React from 'react'
import { NotificationModel } from '../../api/Client'

interface NotificationProps {
    anchor: HTMLElement|null
    handleClose: () => void
}

const Notifications = (props: NotificationProps) => {
    const { notifications, setNotificationOpen, deleteNotification, readNotification } = useContext(WebSocketContext)
    const [ deleting, setDeleting ] = useState<boolean>(false)

    const onNotificationOpen = async(notification: NotificationModel) => {
        if (deleting) {
            return
        }
        await readNotification(notification)
        setNotificationOpen(notification)
    }

    const deletingNotification = async(notification: NotificationModel) => {
        await deleteNotification(notification)
    }

    return (
        <Menu
        sx={{ mt: '45px'}}
        id='menu-appbar'
        anchorEl={props.anchor}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={Boolean(props.anchor)}
        onClose={props.handleClose}
        >
            {notifications.length > 0 ? (notifications.map(notification => (
                <MenuItem key={notification.id} onClick={async () => await onNotificationOpen(notification)}>
                    <Badge color='secondary' variant='dot' invisible={notification.read}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', width: '40vw'}}>   
                            <Typography style={{margin: 'auto 0 auto', maxWidth: '30vw', overflow: 'hidden', textOverflow: 'ellipsis'}}> {notification.body} </Typography>
                            <IconButton 
                            onMouseEnter={() => setDeleting(true)} 
                            onMouseLeave={() => setDeleting(false)} 
                            onClick={async () => await deletingNotification(notification)}
                            >
                                <ClearIcon/>
                            </IconButton>
                        </Box>
                    </Badge>
                </MenuItem>
            ))) : <Typography sx={{margin: '10px'}}> No New Notifications!</Typography>}
        </Menu>
    )
}

export default Notifications