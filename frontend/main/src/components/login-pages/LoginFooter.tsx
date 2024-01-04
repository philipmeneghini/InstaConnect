import { AppBar, Toolbar, Typography } from '@mui/material'
import { ReleaseVersion } from '../../utils/Constants'
import React from 'react'

const LoginFooter = () => {

    return(
        <AppBar position='fixed' color='primary' sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
                <Typography variant='subtitle1' component='div' sx={{ flexGrow: 1 }}>
                    Version: {ReleaseVersion}
                </Typography>   
            </Toolbar>
        </AppBar>
    )
}

export default LoginFooter