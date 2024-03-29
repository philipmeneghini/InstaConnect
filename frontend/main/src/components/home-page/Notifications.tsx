import { useContext, useMemo, useState } from 'react'
import { NotificationContext } from '../context-provider/NotificationProvider'
import { Badge, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import React from 'react'
import { NotificationModel } from '../../api/Client'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(
    () => ({
        menuBox: {
            display: 'flex', 
            justifyContent: 'space-between', 
            width: '40vw'
        },
        menuText: { 
            margin: 'auto 0 auto', 
            maxWidth: '30vw', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis'
        },
        defaultText: {
            margin: '10px'
        }
  }))

interface NotificationProps {
    anchor: HTMLElement|null
    handleClose: () => void
}

const Notifications = (props: NotificationProps) => {
    const { notifications, setNotificationOpen, deleteNotification, readNotification } = useContext(NotificationContext)
    const [ deleting, setDeleting ] = useState<boolean>(false)
    const sortedNotifications = useMemo(() => {
        return notifications.sort((n1, n2) => { 
            if (n1.dateCreated) {
                if (n2.dateCreated){
                    return new Date(n2.dateCreated).getTime() - new Date(n1.dateCreated).getTime()
                }
                else {
                    return -1
                }
            }
            else {
                return 1
            }})
    }, [notifications])

    const {
      menuBox,
      menuText,
      defaultText
    } = useStyles().classes

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
            {notifications.length > 0 ? sortedNotifications.map(notification => (
                <MenuItem key={notification.id} onClick={async () => await onNotificationOpen(notification)}>
                    <Badge color='secondary' variant='dot' invisible={notification.read}>
                        <Box className={menuBox}>   
                            <Typography className={menuText}> {notification.body} </Typography>
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
            )) : <Typography className={defaultText}> No New Notifications!</Typography>}
        </Menu>
    )
}

export default Notifications