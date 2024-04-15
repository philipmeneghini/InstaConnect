import React, { useState, createContext } from 'react'
import { Alert, AlertColor, Snackbar } from '@mui/material'

interface FormProperties {
    isOpen: boolean,
    isSuccess: boolean,
    message: string,
    statusCode?: number | undefined
  }

interface ToastProviderProps {
    children: React.ReactNode
  }

export const ToastContext =
    createContext({
        openToast: (isSuccess: boolean, message: string) => {}
    })

const ToastProvider = (props: ToastProviderProps) => {
    const [ toast, setToast ] = useState<FormProperties>({
        isOpen: false,
        isSuccess: false,
        message: ''
    })

    const openToast = (isSuccess: boolean, message: string) => {
        setToast({
            isOpen: true,
            isSuccess: isSuccess,
            message: message
        })
    }

    const handleClose = () => {
        setToast({
          ...toast,
          isOpen: false
        })
      }
    
      const handleSeverity = () => {
        if(toast.isSuccess) {
          return 'success' as AlertColor
        }
        else {
          return 'error' as AlertColor
        }
      }

    return (
        <ToastContext.Provider value={{openToast: openToast}}>
            {props.children}
            <Snackbar
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} 
            open={toast.isOpen} 
            autoHideDuration={6000} 
            onClose={handleClose}
            key={'bottomcenter'}
            >
                <Alert severity={handleSeverity()} sx={{ width: '100%' }}>
                {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    )
}
export default ToastProvider