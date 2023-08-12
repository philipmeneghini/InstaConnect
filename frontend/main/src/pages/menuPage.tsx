import { AxiosRequestConfig } from 'axios'
import { useEffect, useState } from 'react'
import { UserModel } from '../api_views/IBaseApiClient'
import { _userApiClient } from '../App'
import Header from '../components/Header'

export const MenuPage = () => {
    const [ user, setUser ] = useState<UserModel | null>(null)

    useEffect(() => {
        const getUser = async(jwt: string | null, email: string | null) => {
            if (jwt && email) {
                const header: AxiosRequestConfig = {headers: {Authorization: 'Bearer ' + jwt}}
                const response = await _userApiClient.getUser(email, header)
                if (response.data && !user) {
                    console.log(response.data)
                    setUser(response.data)
                }
            }
        }
        getUser(localStorage.getItem('token'), localStorage.getItem('user'))
    })

    return (
        user ? 
        <div>
            <Header/>
        </div> :
        <></>
)}

export default MenuPage