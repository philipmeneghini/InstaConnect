import {AppBar, Box, Button, Grid, Toolbar, Typography} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../utils/Constants'

interface LoginProps {
  sideButton: string
  sideButtonPath: string
}

export const LoginHeader = (props: LoginProps) => {

  const navigate = useNavigate()

  return (
    <AppBar>
      <Toolbar>
        <Grid container>
          <Grid item xs={3}>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h4' component='div' sx={{ flexGrow: 1 }}>
              InstaConnect
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
              {Paths && <Button color='inherit' onClick={() => navigate(props.sideButtonPath, { replace: true })}>
              {props.sideButton}
            </Button>}
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default LoginHeader