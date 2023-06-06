import {AppBar, Button, Toolbar, Typography} from '@mui/material'
import React from 'react'

export const LoginHeader = () => {

  

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          InstaConnect
        </Typography>
        <Button color="inherit">
          Register
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default LoginHeader