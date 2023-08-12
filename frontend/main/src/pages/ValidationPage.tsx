import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Paths } from '../utils/Constants'
import { _authenticationApiClient } from '../App'

export const ValidationPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const checkVerification = async(token: string): Promise<void> => {
            const response = await _authenticationApiClient.verifyToken(token)
            const result = response.data ? response.data : false
            if (result) {
                localStorage.setItem('token', token)
                localStorage.setItem('user', result.email)
                navigate(Paths['MenuPage'], { replace: true })
            }
        }
        checkVerification(searchParams.get('token') as string)
    })
    
    return (
        <></>
)}

export default ValidationPage