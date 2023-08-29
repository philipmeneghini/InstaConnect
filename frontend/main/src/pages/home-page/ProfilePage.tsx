import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { UserModel } from '../../api/Client'
import Header from '../../components/home-page/Header'
import React from 'react'
import axios from 'axios'
import { Avatar, Typography } from '@mui/material'

export const ProfilePage = () => {
    const [ user, setUser ] = useState<UserModel | null>(null)
    const [ profilePicture, setProfilePicture ] = useState<string>()

    useEffect(() => {
        const getUser = async(jwt: string | null | undefined) => {
            if (jwt) {
                try {
                    const jwtResponse = await _apiClient.verifyToken(jwt)
                    const response = await _apiClient.userGET(jwtResponse.email)
                    setUser(response)
                }
                catch {
                    setUser(null)
                }
            }
        }
        getUser(localStorage.getItem('token'))

    }, [])

    useEffect(() => {
        const validateUrl = async(url: string) => { 
            try {
                await axios.get(url)
                setProfilePicture(url)
            } 
            catch {
                setProfilePicture('')
            }
        }
        validateUrl(user?.profilePictureUrl as string)
    }, [user])

    return (
        user ? 
        <div>
            <Header user={user}/>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '35px'}}>
                <Avatar src={profilePicture}  sx={{ width: 100, height: 100 }}/>
                <Typography>
                    {user.firstName} {user.lastName}
                </Typography>
            </div>
        </div> :
        <></>
)}

export default ProfilePage