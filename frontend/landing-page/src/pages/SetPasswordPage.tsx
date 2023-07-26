import { Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { _authenticationApiClient } from '../App'
import LoginHeader from '../components/LoginHeader'
import PasswordForm from '../components/PasswordForm'


const checkVerification = async(token: string): Promise<boolean> => {
    const response = await _authenticationApiClient.verifyToken(token)
    return response.data ? response.data : false
}

export const SetPasswordPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        const checkVerification = async(token: string): Promise<void> => {
            const response = await _authenticationApiClient.verifyToken(token)
            const result = response.data ? response.data : false
            if (result) {
                setAuthenticated(true)
            }
        }
        checkVerification(searchParams.get('token') as string)
    })

    const NotAuthenticated = (
        <>
            <LoginHeader sideButton='' sideButtonPath=''/>
            <Alert style={{position:'fixed', bottom:'0%', width:'100%'}} variant='filled' severity='error'>
                <strong>Invalid URL or Improper Authentication </strong>
            </Alert>
        </>
        
    )

    const SetPasswordView = (
        <div>
            Set Password!
        </div>
    )
    return (
        <PasswordForm/>
)}

export default SetPasswordPage