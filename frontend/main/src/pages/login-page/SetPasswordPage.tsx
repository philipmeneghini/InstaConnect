import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { _apiClient } from '../../App'
import PasswordForm from '../../components/login-pages/PasswordForm'

export const SetPasswordPage = () => {
    const [searchParams] = useSearchParams()
    const [authenticated, setAuthenticated] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
        const checkVerification = async(token: string): Promise<void> => {
            try{
                const response = await _apiClient.verifyToken(token)
                setAuthenticated(true)
                setEmail(response.email as string)
            }
            catch (err: any) {
                return
            }
        }
        checkVerification(searchParams.get('token') as string)
    }, [searchParams])

    return (
    authenticated ?
    (<div>
        <PasswordForm email={email}/>
    </div>) : <></>
)}

export default SetPasswordPage