import React, { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { ContentModel, UserModel } from '../../api/Client'
import Header from '../../components/home-page/Header'
import axios from 'axios'
import { Avatar, Box, Button, Grid, ImageList, ImageListItem, Modal, Typography } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { UserContents } from './HomePage'
import PostContentBox from '../../components/home-page/PostContentBox'

const postBoxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    maxHeight: '90vh',
    bgcolor: 'whitesmoke',
    border: '1px solid #000',
    p: '2vh',
    overflow: 'hidden',
    overflowY: 'scroll',
}

export const ProfilePage = () => {
    const [ user, setUser ] = useState<UserModel | null>()
    const [ profile, setProfile ] = useState<UserModel | null>();
    const [ profilePicture, setProfilePicture ] = useState<string>()
    const [ contents, setContents ] = useState<ContentModel[]>(new Array<ContentModel>())
    const [ content, setContent ] = useState<ContentModel | null>(null)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const getUserProfileAndContents = async(jwt: string | null | undefined) => {
            if (jwt) {
                try {
                    const jwtResponse = await _apiClient.verifyToken(jwt)
                    const user = await _apiClient.userGET(jwtResponse.email)
                    setUser(user)
                    let profile: UserModel
                    if (searchParams.get('email')) {
                        profile = await _apiClient.userGET(searchParams.get('email') as string)
                    }
                    else {
                        profile = user
                    }
                    setProfile(profile)
                    const contents = await _apiClient.contentsGET(profile?.email)
                    setContents(contents)
                }
                catch {
                    setUser(null)
                    setContents(new Array<ContentModel>())
                }
            }
        }
        getUserProfileAndContents(localStorage.getItem('token'))

    }, [searchParams])

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
        validateUrl(profile?.profilePictureUrl as string)
    }, [user, profile?.profilePictureUrl])

    const handleOpen = (content: ContentModel) => { setContent(content) }
    const handleClose = () => { setContent(null) }

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
                        {profile?.firstName} {profile?.lastName}
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
                                {profile?.followers ? profile?.followers?.length : 0 } 
                            </Typography>
                            <Typography> Followers </Typography>
                        </div>
                    </Grid>
                    <Grid item xs ={5} sx={{ display: 'flex', justifyContent: 'center'}}>
                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                            <Typography> 
                                {profile?.following ? profile?.following?.length : 0 } 
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
            <Modal
            open={content ? true : false}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            >
                <Box sx={postBoxStyle}>
                    <PostContentBox userContent={{user: profile as UserModel, content: content as ContentModel} as UserContents} user={user} handleClose={handleClose}/>
                </Box>
            </Modal>
        </div> :
        <></>
)}

export default ProfilePage