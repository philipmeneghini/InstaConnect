import React, { useContext, useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { ContentModel, UserModel } from '../../api/Client'
import Header from '../../components/home-page/Header'
import { Avatar, Box, Button, Grid, ImageList, ImageListItem, Modal, Typography } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { UserContents } from './HomePage'
import PostContentBox from '../../components/home-page/PostContentBox'
import CreatePostBox from '../../components/home-page/CreatePostBox'
import EditProfile from '../../components/home-page/EditProfile'
import ProfileDetailBox from '../../components/home-page/ProfileDetailBox'
import useProfilePicture from '../../hooks/useProfilePicture'
import useLazyContents from '../../hooks/useLazyContents'
import { UserContext } from '../../components/context-provider/UserProvider'

const postBoxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    maxHeight: '95vh',
    bgcolor: 'white',
    border: '1px solid #000',
    p: '2vh',
    overflowY: 'auto',
}

export const ProfilePage = () => {
    const [ profile, setProfile ] = useState<UserModel | null>()
    const [ numberOfPosts, setNumberOfPosts ] = useState<number>()
    //const [ contents, setContents ] = useState<ContentModel[]>(new Array<ContentModel>())
    const [ content, setContent ] = useState<ContentModel | null>(null)
    const [ isFollowing, setIsFollowing ] = useState<boolean>()
    const [ creatPostOpen, setCreatePostOpen ] = useState<boolean>(false)
    const [ editProfileOpen, setEditProfileOpen ] = useState<boolean>(false)
    const [ profileDetailOpen, setProfileDetailOpen ] = useState<boolean>(false)

    const [ profilePicture ] = useProfilePicture(profile?.profilePictureUrl)
    const [ searchParams ] = useSearchParams()
    const { user } = useContext(UserContext)
    const [ ref, contents, setContents ] = useLazyContents('Failed to load posts!', 10, profile !== null  && profile !== undefined ? [profile?.email as string] : [])

    useEffect(() => {
        const getUserProfile = async() => {
            try {
                let profile: UserModel
                if (searchParams.get('email')) {
                    profile = await _apiClient.userGET(searchParams.get('email') as string)
                }
                else {
                    profile = user as UserModel
                }
                setProfile(profile)
            }
            catch {
                setProfile(null)
            }
        }
        getUserProfile()

    }, [ user, searchParams ])

    useEffect(() => {
        const getNumberOfPosts = async() => {
            if (profile !== undefined) {
                const res = await _apiClient.contentsAmount(profile?.email)
                setNumberOfPosts(res)
            }
        }
        getNumberOfPosts()
    }, [profile])

    useEffect(() => {
        if (user && profile && user?.following?.includes(profile?.email) && profile?.followers?.includes(user?.email))
            setIsFollowing(true)
        else
            setIsFollowing(false)
    }, [ user, profile ])

    const handleOpen = (content: ContentModel) => { setContent(content) }
    const handleClose = async () => { 
        setContent(null)
    }

    const handleFollowButton = async () => {
        try {
            if (profile && user) {
                if (isFollowing) {
                    const userIndex: number = user?.following?.indexOf(profile?.email, 0) ?? -1
                    const profileIndex: number = profile?.followers?.indexOf(user?.email, 0) ?? -1
                    if (userIndex !== -1)
                        user?.following?.splice(userIndex, 1)
                    if(profileIndex !== -1)
                        profile?.followers?.splice(profileIndex, 1)
                }
                else {
                    if (!user?.following?.includes(profile?.email))
                        user?.following?.push(profile?.email)
                    if (!profile?.followers?.includes(user?.email))
                        profile?.followers?.push(user?.email)
                }

                await _apiClient.usersPUT( [ user, profile ] )
            }
        }
        catch {
            return
        }
    }

    const handleCreatePost = () => { setCreatePostOpen(true) }
    const handleCreatePostClose = () => {
        setCreatePostOpen(false) 
    }

    const addPost = (post: ContentModel) => {
        setContents([post, ...contents])
        setNumberOfPosts(prev => prev === undefined ? 1 : prev + 1)
    }

    const handleEditProfileOpen = () => { setEditProfileOpen(true) }
    const handleEditProfileClose = () => { setEditProfileOpen(false) }

    const handleProfileDetailOpen = () => { setProfileDetailOpen(true) }
    const handleProfileDetailClose = () => { setProfileDetailOpen(false) }

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
                            <Typography> {numberOfPosts} </Typography>
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
                {user === profile ?
                <Grid container mt={2} sx={{ maxWidth: '700px' }}>
                    <Grid item xs ={6} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                        <Button variant='contained' onClick={handleCreatePost} sx={{ borderRadius: 28 }}> 
                            Create Post
                        </Button>
                    </Grid>
                    <Grid item xs ={6} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                        <Button variant='contained' sx={{ borderRadius: 28 }} onClick={handleEditProfileOpen}> 
                            Edit Profile
                        </Button>
                    </Grid>
                </Grid> : 
                <Grid container mt={2} sx={{ maxWidth: '700px' }}>
                <Grid item xs ={6} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                    <Button variant='contained' onClick={handleFollowButton} sx={{ borderRadius: 28 }}> 
                        {isFollowing ? 'UnFollow' : 'Follow'}
                    </Button>
                </Grid>
                <Grid item xs ={6} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                    <Button variant='contained' onClick={handleProfileDetailOpen} sx={{ borderRadius: 28 }}> 
                        Profile
                    </Button>
                </Grid>
            </Grid>}
            </div>
            <ImageList sx={{ maxWidth: '100vw'}} cols={9} rowHeight={164}>
                {contents.map((content) => (
                    <ImageListItem sx={{maxHeight: '164', overflow: 'hidden'}} key={content.mediaUrl} onClick={() => handleOpen(content)}>
                        <img
                            style={{height: '164'}}
                            src={content.mediaUrl}
                            srcSet={content.mediaUrl}
                            alt={content.caption}
                            loading='lazy'
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <div ref={ref}></div>
            <Modal
            open={content ? true : false}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            >
                <Box sx={postBoxStyle}>
                    <PostContentBox userContent={{user: profile as UserModel, content: content as ContentModel} as UserContents} handleClose={handleClose}/>
                </Box>
            </Modal>
            <Modal
            open={creatPostOpen}
            onClose={handleCreatePostClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            >
                <Box sx={postBoxStyle}>
                    <CreatePostBox addPost={addPost} handleClose={handleCreatePostClose}/>
                </Box>
            </Modal>
            <Modal
            open={editProfileOpen}
            onClose={handleEditProfileClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            >
                <Box sx={postBoxStyle}>
                    <EditProfile user={profile} handleClose={handleEditProfileClose}/>
                </Box>
            </Modal>
            <Modal
            open={profileDetailOpen}
            onClose={handleProfileDetailClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            >
                <Box sx={postBoxStyle}>
                    <ProfileDetailBox user={user} profile={profile as UserModel} handleClose={handleProfileDetailClose}/>
                </Box>
            </Modal>
        </div> :
        <></>
)}

export default ProfilePage