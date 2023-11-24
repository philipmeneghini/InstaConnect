import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { UserModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, Button, Typography } from '@mui/material'


interface CreatePostProps {
    handleClose: () => void
}

export const CreatePostBox = ( props: CreatePostProps ) => {

    const [ user, setUser ] = useState<UserModel>()
    const [ error, setError ] = useState<string | undefined>()

    useEffect(() => {
        const getUserContents = async(jwt: string | null | undefined) => {
            if (jwt) {
                try {
                    const jwtResponse = await _apiClient.verifyToken(jwt)
                    const user = await _apiClient.userGET(jwtResponse.email)
                    setUser(user)
                }
                catch(err: any) {
                    setError(err.message)
                    setUser(undefined)
                }
            }
            else {
                setError('No valid jwt token in local storage')
            }
        }
        getUserContents(localStorage.getItem('token'))
    })

    const handleCloseErrorMessage = () => {
        setError(undefined)
    }

    return (<>
                <Box sx={{display:'flex', justifyContent: 'space-between', marginBottom: '2vh'}}>
                    <Box sx={{display:'flex', justifyContent: 'space-between', marginLeft: '2%'}}>
                        <Avatar src={user?.profilePictureUrl} sx={{ width: '5vh', height: '5vh'}}/>
                            <Typography sx={{margin: '0.5vh 0 0.5vh 1vh'}}> {user?.firstName} {user?.lastName} </Typography>
                    </Box>
                    <Button variant='contained' onClick={props?.handleClose}> Close </Button>
                </Box>
            </>)
}

export default CreatePostBox