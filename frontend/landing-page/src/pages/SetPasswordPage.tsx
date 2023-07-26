import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { _authenticationApiClient } from '../App'
import LoginHeader from '../components/LoginHeader'
import PasswordForm from '../components/PasswordForm'
import { Paths } from '../utils/Constants'

export const SetPasswordPage = () => {
    const [searchParams] = useSearchParams()
    const [authenticated, setAuthenticated] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
        const checkVerification = async(token: string): Promise<void> => {
            const response = await _authenticationApiClient.verifyToken(token)
            const result = response.data ? response.data : false
            if (result) {
                setAuthenticated(true)
                setEmail(response.data?.email as string)
            }
        }
        checkVerification(searchParams.get('token') as string)
    })

    return (
    authenticated ?
    (<div>
        <PasswordForm email={email}/>
    </div>) : <></>
)}

export default SetPasswordPage