import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { UserModel } from '../../api/Client'
import Header from '../../components/home-page/Header'
import React from 'react'

export const MenuPage = () => {
    const [ user, setUser ] = useState<UserModel | null>(null)

    useEffect(() => {
        const getUser = async(jwt: string | null | undefined) => {
            if (jwt) {
                try {
                    const jwtResponse = await _apiClient.verifyToken(jwt)
                    const response = await _apiClient.userGET(jwtResponse.email)
                    setUser(response)
                }
                catch {
                    return
                }
            }
        }
        getUser(localStorage.getItem('token'))

    }, [])

    return (
        user ? 
        <div>
            <Header user={user}/>
        </div> :
        <></>
)}

export default MenuPage