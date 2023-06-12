import {AppBar, Button, Toolbar, Typography} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface LoginProps {
  sideButton: string
  sideButtonPath: string
}

export const LoginHeader = (props: LoginProps) => {

  const navigate = useNavigate()

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          InstaConnect
        </Typography>
        <Button color="inherit" onClick={() => navigate(props.sideButtonPath, { replace: true })}>
          {props.sideButton}
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default LoginHeader