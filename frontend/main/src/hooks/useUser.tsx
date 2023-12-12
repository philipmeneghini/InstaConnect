import { useEffect, useState } from 'react'
import { _apiClient } from '../App'
import { UserModel } from '../api/Client'

const useUser = (): [ UserModel | undefined, React.Dispatch<React.SetStateAction<UserModel | undefined>> ] => {

    const [ user, setUser ] = useState<UserModel>()
    
    useEffect(() => {
        const getUser = async(jwt: string | null | undefined) => {
            if (jwt) {
                try {
                    const jwtResponse = await _apiClient.verifyToken(jwt)
                    const user = await _apiClient.userGET(jwtResponse.email)
                    setUser(user)
                }
                catch(err: any) {
                    setUser(undefined)
                }
            }
        }

        getUser(localStorage.getItem('token'))
    }, [])

    return [ user as UserModel | undefined, setUser as React.Dispatch<React.SetStateAction<UserModel | undefined>> ]
}

export default useUser