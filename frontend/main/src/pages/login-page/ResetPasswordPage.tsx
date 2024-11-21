import React from 'react'
import ResetPasswordForm from '../../components/login-pages/ResetPasswordForm'
import LoginFooter from '../../components/login-pages/LoginFooter'
import { Paper, Typography } from '@mui/material'
import LoginHeader from '../../components/login-pages/LoginHeader'
import { Paths } from '../../utils/Constants'

export const ResetPasswordPage = () => {

    return (
        <div>
            <LoginHeader sideButton='Login' sideButtonPath={Paths['Login']}/>
            <Paper elevation={5} sx={{padding:'20px', margin:'20vh 25vw'}}>
                <Typography variant='h4'> Reset Password </Typography>
                <ResetPasswordForm/>
            </Paper>
            <LoginFooter/>
        </div>
    )}

export default ResetPasswordPage