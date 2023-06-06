import {Alert, AlertColor, Snackbar} from '@mui/material'
import React from 'react'
import { LoginProperties } from '../pages/LoginPage'

interface AlertProps {
  login: LoginProperties,
  setLogin: React.Dispatch<React.SetStateAction<LoginProperties>>
}

export const LoginAlert = (props: AlertProps) => {

  const handleClose = () => {
    props.setLogin({
      ...props.login,
      isOpen: false
    })
  }

  const handleSeverity = () => {
    if(props.login.isSuccess) {
      return "success" as AlertColor
    }
    else {
      return "error" as AlertColor
    }
  }

  return (
    <Snackbar 
      anchorOrigin={{vertical: "bottom", horizontal: "center"}} 
      open={props.login.isOpen} 
      autoHideDuration={6000} 
      onClose={handleClose}
      key={"bottomcenter"}
      >
        <Alert severity={handleSeverity()} sx={{ width: '100%' }}>
          {props.login.message}
        </Alert>
    </Snackbar>
  )
}

export default LoginAlert