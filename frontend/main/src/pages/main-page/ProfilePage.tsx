import React, { useContext, useEffect, useMemo, useState } from 'react'
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
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(
    () => ({
        headerBox: {
            marginTop: '85px', 
            display: 'flex', 
            justifyContent: 'center', 
            flexDirection: 'column', 
            width: 'auto', 
            alignItems: 'center'
        },
        profilePictureBox: { 
            paddingBottom: '40px'
        },
        profilePictureAvatar: {
            width: 100, 
            height: 100
        },
        profileName: {
            paddingBottom: '25px'
        },
        infoGrid: {
            maxWidth: '500px'
        },
        infoItemGrid: {
            display: 'flex', 
            justifyContent: 'center',
        },
        infoItemBox: {
            display: 'flex', 
            justifyContent: 'center',
            flexDirection: 'column'
        },
        actionButtonGrid: {
            maxWidth: '700px'
        },
        actionButtonItem: {
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'center'
        },
        actionButton: {
            borderRadius: 28
        },
        imageList: {
            maxWidth: '100vw'
        },
        imageListItem: {
            maxHeight: '164', 
            overflow: 'hidden'
        },
        image: {
            height: '164'
        },
  }))

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
    const [ content, setContent ] = useState<ContentModel | null>(null)
    const [ creatPostOpen, setCreatePostOpen ] = useState<boolean>(false)
    const [ editProfileOpen, setEditProfileOpen ] = useState<boolean>(false)
    const [ profileDetailOpen, setProfileDetailOpen ] = useState<boolean>(false)

    const [ profilePicture ] = useProfilePicture(profile?.profilePictureUrl)
    const [ searchParams ] = useSearchParams()
    const { user, refreshUser } = useContext(UserContext)
    const [ ref, contents, setContents ] = useLazyContents('Failed to load posts!', 
                                                            10, 
                                                            profile !== null  && profile !== undefined ? [profile?.email as string] : [])

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

    const isFollowing: boolean = useMemo(() => {
        if (user && profile && user?.following?.includes(profile?.email) && profile?.followers?.includes(user?.email))
            return true
        else
            return false
    }, [ user, profile ])

    const {
        headerBox,
        profilePictureBox,
        profilePictureAvatar,
        profileName,
        infoGrid,
        infoItemGrid,
        infoItemBox,
        actionButtonGrid,
        actionButtonItem,
        actionButton,
        imageList,
        imageListItem,
        image,
    } = useStyles().classes

    const handleOpen = (content: ContentModel) => { setContent(content) }
    const handleClose = async () => { 
        setContent(null)
    }

    const handleFollowButton = async () => {
        try {
            if (profile && user) {
                const userFollowing = user?.following ?? []
                const profileFollowers = profile?.followers ?? []
                if (isFollowing) {
                    const userIndex: number = userFollowing.indexOf(profile?.email, 0) ?? -1
                    const profileIndex: number = profileFollowers.indexOf(user?.email, 0) ?? -1
                    if (userIndex !== -1)
                        userFollowing.splice(userIndex, 1)
                    if(profileIndex !== -1)
                        profileFollowers.splice(profileIndex, 1)
                }
                else {
                    if (!userFollowing.includes(profile?.email))
                        userFollowing.push(profile?.email)
                    if (!profileFollowers.includes(user?.email))
                        profileFollowers.push(user?.email)
                }

                await _apiClient.userPATCH(user?.email, 
                [{
                    op: 'add',
                    path: '/following',
                    value: userFollowing
                }]);

                await _apiClient.userPATCH(profile?.email, 
                [{
                    op: 'add',
                    path: '/followers',
                    value: profileFollowers
                }]);

                profile.followers = profileFollowers
                setProfile(profile)
                refreshUser()
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

    
    const handleDeletePost = (id: string) => {
        let newContents: ContentModel[] = [...contents]
        const ind = newContents.findIndex(c => c.id === id)
        newContents.splice(ind, 1)
        setContents(newContents)
        setNumberOfPosts(prev => prev === undefined ? 0 : prev -1)
    }

    const handleEditProfileOpen = () => { setEditProfileOpen(true) }
    const handleEditProfileClose = () => { setEditProfileOpen(false) }

    const handleProfileDetailOpen = () => { setProfileDetailOpen(true) }
    const handleProfileDetailClose = () => { setProfileDetailOpen(false) }

    return (
        user ? 
        <div>
            <Header user={user}/>
            <div className={headerBox}>
                <div className={profilePictureBox}>
                    <Avatar src={profilePicture}  className={profilePictureAvatar}/>
                </div>
                <div className={profileName}>
                    <Typography>
                        {profile?.firstName} {profile?.lastName}
                    </Typography>
                </div>
                <Grid container className={infoGrid}>
                    <Grid item xs ={5} className={infoItemGrid}>
                        <div className={infoItemBox}>
                            <Typography> {numberOfPosts} </Typography>
                            <Typography> Posts </Typography>
                        </div>
                    </Grid>
                    <Grid item xs ={2} className={infoItemGrid}>
                        <div className={infoItemBox}>
                            <Typography> 
                                {profile?.followers ? profile?.followers?.length : 0 } 
                            </Typography>
                            <Typography> Followers </Typography>
                        </div>
                    </Grid>
                    <Grid item xs ={5} className={infoItemGrid}>
                        <div className={infoItemBox}>
                            <Typography> 
                                {profile?.following ? profile?.following?.length : 0 } 
                            </Typography>
                            <Typography> Following </Typography>
                        </div>
                    </Grid>
                </Grid>
                {user === profile ?
                <Grid container mt={2} className={actionButtonGrid}>
                    <Grid item xs ={6} className={actionButtonItem}>
                        <Button variant='contained' onClick={handleCreatePost} className={actionButton}> 
                            Create Post
                        </Button>
                    </Grid>
                    <Grid item xs ={6} className={actionButtonItem}>
                        <Button variant='contained' className={actionButton} onClick={handleEditProfileOpen}> 
                            Edit Profile
                        </Button>
                    </Grid>
                </Grid> : 
                <Grid container mt={2} className={actionButtonGrid}>
                <Grid item xs ={6} className={actionButtonItem}>
                    <Button variant='contained' onClick={handleFollowButton} className={actionButton}> 
                        {isFollowing ? 'UnFollow' : 'Follow'}
                    </Button>
                </Grid>
                <Grid item xs ={6} className={actionButtonItem}>
                    <Button variant='contained' onClick={handleProfileDetailOpen} className={actionButton}> 
                        Profile
                    </Button>
                </Grid>
            </Grid>}
            </div>
            <ImageList className={imageList} cols={8} rowHeight={164}>
                {contents.map((content, index) => (
                    <>
                        <ImageListItem className={imageListItem} key={content.mediaUrl} onClick={() => handleOpen(content)}>
                            <img
                                className={image}
                                src={content.mediaUrl}
                                srcSet={content.mediaUrl}
                                alt={content.caption}
                                loading='lazy'
                            />
                        </ImageListItem>
                        {(index === contents.length-1) ? <div ref={ref}></div> : <></>}
                    </>
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
                    <PostContentBox userContent={{user: profile as UserModel, content: content as ContentModel} as UserContents} handleClose={handleClose} deletePost={handleDeletePost}/>
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