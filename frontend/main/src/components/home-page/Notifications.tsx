import { useContext } from 'react'
import { WebSocketContext } from '../context-provider/WebSocketProvider'
import { Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'

interface NotificationProps {
    anchor: HTMLElement|null
    handleClose: () => void
}

const Notifications = (props: NotificationProps) => {
    const { notifications } = useContext(WebSocketContext)

    return (
        <Menu
        sx={{ mt: '45px' }}
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
            {notifications.map(notification => (
                <MenuItem key={notification.id}>
                    <Typography> {notification.body} </Typography>
                </MenuItem>
            ))}
        </Menu>
    )
}

export default Notifications