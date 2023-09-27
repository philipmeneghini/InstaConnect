import React, { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { ContentModel, UserModel } from '../../api/Client'
import Header from '../../components/home-page/Header'
import axios from 'axios'
import { Avatar, Button, Grid, ImageList, ImageListItem, Typography } from '@mui/material'
import MediaPostBox from '../../components/profile-page/MediaPostBox'

export const ProfilePage = () => {
    const [ user, setUser ] = useState<UserModel | null>()
    const [ profilePicture, setProfilePicture ] = useState<string>()
    const [ contents, setContents ] = useState<ContentModel[]>(new Array<ContentModel>())
    const [ content, setContent ] = useState<ContentModel | null>(null)

    useEffect(() => {
        const getUserAndContents = async(jwt: string | null | undefined) => {
            if (jwt) {
                try {
                    const jwtResponse = await _apiClient.verifyToken(jwt)
                    const user = await _apiClient.userGET(jwtResponse.email)
                    setUser(user)
                    const contents = await _apiClient.contentsGET(jwtResponse.email)
                    console.log(contents[0].mediaUrl)
                    setContents(contents)
                }
                catch {
                    setUser(null)
                    setContents(new Array<ContentModel>())
                }
            }
        }
        getUserAndContents(localStorage.getItem('token'))

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

    const handleOpen = (content: ContentModel) => { setContent(content) }

    return (
        user ? 
        <div>
            <Header user={user}/>
            <div style={{ marginTop: '12vh', display: 'flex', justifyContent: 'center', flexDirection: 'column', width: 'auto', alignItems: 'center' }}>
                <div style={{ paddingBottom: '40px' }}>
                    <Avatar src={profilePicture}  sx={{ width: 100, height: 100 }}/>
                </div>
                <div style={{ paddingBottom: '25px' }}>
                    <Typography>
                        {user.firstName} {user.lastName}
                    </Typography>
                </div>
                <Grid container sx={{ maxWidth: '500px' }}>
                    <Grid item xs ={5} sx={{ display: 'flex', justifyContent: 'center'}}>
                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                            <Typography> {contents.length} </Typography>
                            <Typography> Posts </Typography>
                        </div>
                    </Grid>
                    <Grid item xs ={2} sx={{ display: 'flex', justifyContent: 'center'}}>
                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                            <Typography> 
                                {user.followers ? user.followers?.length : 0 } 
                            </Typography>
                            <Typography> Followers </Typography>
                        </div>
                    </Grid>
                    <Grid item xs ={5} sx={{ display: 'flex', justifyContent: 'center'}}>
                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                            <Typography> 
                                {user.following ? user.following?.length : 0 } 
                            </Typography>
                            <Typography> Following </Typography>
                        </div>
                    </Grid>
                </Grid>
                <Grid container mt={2} sx={{ maxWidth: '700px' }}>
                    <Grid item xs ={6} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                        <Button variant='contained' sx={{ borderRadius: 28 }}> 
                            Create Post
                        </Button>
                    </Grid>
                    <Grid item xs ={6} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                        <Button variant='contained' sx={{ borderRadius: 28 }}> 
                            Edit Profile
                        </Button>
                    </Grid>
                </Grid>
            </div>
            <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                {contents.map((content) => (
                    <ImageListItem key={content.mediaUrl} onClick={() => handleOpen(content)}>
                        <img
                            src={content.mediaUrl}
                            srcSet={content.mediaUrl}
                            alt={content.caption}
                            loading='lazy'
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <MediaPostBox user={user} content={content} setContent={setContent} profilePicture={profilePicture}/>
        </div> :
        <></>
)}

export default ProfilePage