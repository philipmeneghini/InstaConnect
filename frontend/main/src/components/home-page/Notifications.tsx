import { useContext } from 'react'
import { WebSocketContext } from '../context-provider/WebSocketProvider'
import { Badge, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import React from 'react'

interface NotificationProps {
    anchor: HTMLElement|null
    handleClose: () => void
}

const Notifications = (props: NotificationProps) => {
    const { notifications, deleteNotification } = useContext(WebSocketContext)

    const handleOpenNotification = () => {

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
            {notifications.map(notification => (
                <MenuItem key={notification.id} onClick={handleOpenNotification}>
                    <Badge color='secondary' variant='dot' invisible={notification.read}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', width: '40vw'}}>
                            <Typography sx={{margin: 'auto 0 auto', maxWidth: '30vw', overflow: 'hidden', textOverflow: 'ellipsis'}}> {notification.body} </Typography>
                            <IconButton onClick={() => deleteNotification(notification)}>
                                <ClearIcon/>
                            </IconButton>
                        </Box>
                    </Badge>
                </MenuItem>
            ))}
        </Menu>
    )
}

export default Notifications