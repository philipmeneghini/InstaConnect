import React, { useState, createContext } from 'react'
import { Alert, AlertColor, Snackbar } from '@mui/material'

interface FormProperties {
    isOpen: boolean,
    isSuccess: boolean,
    message: string,
    statusCode?: number | undefined
  }

export const NotificationContext =
    createContext({
        openNotification: (isSuccess: boolean, message: string) => {}
    })

const NotificationProvider = (props: any) => {
    const [ notification, setNotification ] = useState<FormProperties>({
        isOpen: false,
        isSuccess: false,
        message: ''
    })

    const openNotification = (isSuccess: boolean, message: string) => {
        setNotification({
            isOpen: true,
            isSuccess: isSuccess,
            message: message
        })
    }

    const handleClose = () => {
        setNotification({
          ...notification,
          isOpen: false
        })
      }
    
      const handleSeverity = () => {
        if(notification.isSuccess) {
          return 'success' as AlertColor
        }
        else {
          return 'error' as AlertColor
        }
      }

    return (
        <NotificationContext.Provider value={{openNotification}}>
            {props.children}
            <Snackbar
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} 
            open={notification.isOpen} 
            autoHideDuration={6000} 
            onClose={handleClose}
            key={'bottomcenter'}
            >
                <Alert severity={handleSeverity()} sx={{ width: '100%' }}>
                {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    )
}
export default NotificationProvider