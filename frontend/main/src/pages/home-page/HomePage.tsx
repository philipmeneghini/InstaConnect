import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { ContentModel, UserModel } from '../../api/Client'
import Header from '../../components/home-page/Header'
import React from 'react'
import { Avatar, Box, IconButton, Paper, Typography } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AddCommentIcon from '@mui/icons-material/AddComment'

const interactionToolbarStyle = {
    paddingTop: '1vh',
    display: 'flex',
    justifyContent: 'center',
}

const dateUpdatedDescending = (a: UserContents, b: UserContents): number => {
    if (a.content.dateUpdated && b.content.dateUpdated)
        return 0
    else if (a.content.dateUpdated)
        return 1
    else if (b.content.dateUpdated)
        return -1
    
    return (a.content.dateUpdated ?? new Date) > (b.content.dateUpdated ?? new Date) ? -1 : (a.content.dateUpdated === b.content.dateUpdated ? 0 : 1)
}

interface UserContents {
    user: UserModel
    content: ContentModel
}

export const HomePage = () => {
    const [ user, setUser ] = useState<UserModel | null>(null)
    const [ contents, setContents ] = useState<UserContents[]> ([])
    const [ contentLoadMessage, setContentLoadMessage ] = useState<string | null>(null)

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
        const getUsersFollowing = async(user: UserModel | null) => {
            if (user?.following) {
                    let currentUserContents: UserContents[] = []
                    for (let userFollowing of (user.following)) {
                        try {
                            let contentUser: UserContents
                            let userResponse = await _apiClient.userGET(userFollowing)
                            let contentResponse = await _apiClient.contentsGET(userFollowing)
                            for(let i = 0; i < contentResponse.length; i++) {
                                contentUser = {
                                    user: userResponse,
                                    content: contentResponse[i],
                                }
                                currentUserContents.push(contentUser)
                            }
                        }
                        catch {
                            continue
                        }
                        currentUserContents.sort(dateUpdatedDescending)
                    }
                    currentUserContents.sort(dateUpdatedDescending)
                    setContents(currentUserContents)
                    if (currentUserContents.length > 0)
                        setContentLoadMessage(null)
                    else
                        setContentLoadMessage('No content from users following to show')
            }
            else {
                setContentLoadMessage('You are not currently following anyone')
            }
        }
        getUsersFollowing(user)
    }, [user])

    const handleLike = () => { }

    return (
        user ? 
        <div>
            <Header user={user}/>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                {contents.map( (userContent) => (
                    <Paper elevation={24} sx={{margin: '10vh 0', width: '40vw', padding: '2% 0'}}>
                    <Box sx={{}}>
                        <Box sx={{display:'flex', justifyContent: 'space-between', marginBottom: '2vh'}}>
                            <Box sx={{display:'flex', justifyContent: 'space-between', marginLeft: '2%'}}>
                                <Avatar src={userContent.user.profilePictureUrl} sx={{ width: '5vh', height: '5vh'}}/>
                                <Typography sx={{margin: '0.5vh 0 0.5vh 1vh'}}> {userContent.user.firstName} {userContent.user.lastName} </Typography>
                            </Box>
                        </Box>
                        <img
                            src={userContent.content.mediaUrl}
                            srcSet={userContent.content.mediaUrl}
                            alt={userContent.content.caption}
                            loading='lazy'
                        />
                        <Box sx={interactionToolbarStyle}>
                            <Box sx={{paddingRight: '5vw', display: 'flex', justifyContent: 'center'}}>
                                <IconButton sx={{maxHeight: '3vh'}} size='small' onClick={handleLike}>
                                    <FavoriteBorderIcon/>
                                </IconButton>
                                <Typography paddingLeft={'0.5vw'}> {userContent.content?.likes} likes</Typography>
                            </Box>
                            <Box sx={{paddingLeft: '5vw', display: 'flex', justifyContent: 'center'}}>
                                <IconButton sx={{maxHeight: '3vh'}} size='small' onClick={handleLike}>
                                    <AddCommentIcon/>
                                </IconButton>
                            <Typography paddingLeft={'0.5vw'}> 5 comments</Typography>
                            </Box>
                        </Box>
                    </Box>
                    </Paper>
                ))}
            </Box>
        </div> :
        <></>
)}

export default HomePage