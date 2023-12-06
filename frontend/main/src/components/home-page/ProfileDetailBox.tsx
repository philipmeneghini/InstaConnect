import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { UserModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, Button, Grid, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Tab, Typography } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../utils/Constants'
import { FollowContents } from './Header'
import axios from 'axios'

interface ProfileDetailProps {
    user: UserModel
    handleClose?: (() => void) | undefined
}

export const ProfileDetailBox = ( props: ProfileDetailProps ) => {

    const [ menuSelection, setMenuSelection ] = useState<string>('followers')
    const [ followers, setFollowers ] = useState<FollowContents[]>()
    const [ following, setFollowing ] = useState<FollowContents[]>()

    useEffect(() => {
        const getFollowers = async(users : string[] | undefined) => {
            try {
                const response = await _apiClient.usersGET(users)
                let result : FollowContents[] = new Array<FollowContents>()
                for(let i = 0; i < response.length; i++) {
                    const user : UserModel = response[i]
                    const followContent : FollowContents = { email : user.email , profilePicture : user.profilePictureUrl}
                    try {
                        await axios.get(followContent.profilePicture as string) 
                    }
                    catch {
                        followContent.profilePicture = ''
                    }
                    result.push(followContent)
                }
                setFollowers(result)
            }
            catch {
                setFollowers([])
            }
        }
        console.log(props?.user?.followers)
        getFollowers(props?.user?.followers)
    }, [props])

    useEffect(() => {
        const getFollowing = async(users : string[] | undefined) => {
            try {
                const response = await _apiClient.usersGET(users)
                let result : FollowContents[] = new Array<FollowContents>()
                for(let i = 0; i < response.length; i++) {
                    const user : UserModel = response[i]
                    const followContent : FollowContents = { email : user.email , profilePicture : user.profilePictureUrl}
                    try {
                        await axios.get(followContent.profilePicture as string) 
                    }
                    catch {
                        followContent.profilePicture = ''
                    }
                    result.push(followContent)
                }
                setFollowing(result)
            }
            catch {
                setFollowing([])
            }
        }
        getFollowing(props?.user?.following)
    }, [props])

    const navigate = useNavigate()

    const navigateToProfile = (email : string | undefined) => {
        if (email) {
            if (email === props?.user?.email) {
                navigate(Paths.Profile, {replace: true})
            }
            else {
                navigate({
                    pathname: Paths.Profile,
                    search: `?email=${email}`
                }, {replace: true})
            }
            if (props?.handleClose) {
                props?.handleClose()
            }
        }
    }

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setMenuSelection(newValue)
    }

    return (<>
                <Box sx={{display:'flex', justifyContent: 'space-between', marginBottom: '2vh'}}>
                    <Box sx={{display:'flex', justifyContent: 'space-between', marginLeft: '2%'}}>
                        <Avatar src={props?.user?.profilePictureUrl} sx={{ width: '5vh', height: '5vh'}}/>
                        <IconButton size='small' color='inherit' onClick={() => navigateToProfile(props?.user?.email)}>
                            <Typography sx={{margin: '0.5vh 0 0.5vh 1vh'}}> {props?.user?.firstName} {props?.user?.lastName} </Typography>
                        </IconButton>
                    </Box>
                    { props?.handleClose ? <Button variant='contained' onClick={props?.handleClose}> Close </Button> : <></>}
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <img
                        src={props?.user?.profilePictureUrl}
                        srcSet={props?.user?.profilePictureUrl}
                        alt='profile'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Grid item xs container direction='column' spacing={2}>
                            <Grid item xs>
                                <Typography><b>Name:</b> {props?.user?.firstName} {props?.user?.lastName}</Typography>            
                            </Grid>
                            <Grid item xs>
                                <Typography><b>Email:</b> {props?.user?.email}</Typography>        
                            </Grid>
                            <Grid item xs>
                                <Typography><b>Birthdate:</b> {props?.user?.birthDate}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <TabContext value={menuSelection}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange}>
                            <Tab label='Followers' value='followers' />
                            <Tab label="Following" value='following' />
                        </TabList>
                    </Box>
                    <Box sx={{overflow: 'auto', maxHeight: '30vh'}}>
                        <TabPanel value='followers'>
                            <List sx={{overflowY: 'auto', maxHeight: '65vh'}} component="div" disablePadding>
                                {followers ? followers.map( (follower) => (
                                    <ListItemButton key={follower?.email} onClick={() => navigateToProfile(follower?.email)} sx={{ pl: 4 }}>
                                        <ListItemAvatar>
                                            <Avatar src={follower?.profilePicture}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={follower?.email} />
                                    </ListItemButton>
                                )) : <></>}
                            </List>
                        </TabPanel>
                        <TabPanel value='following'>
                        <List sx={{overflowY: 'auto', maxHeight: '65vh'}} component="div" disablePadding>
                                {following ? following.map( (following) => (
                                    <ListItemButton key={following?.email} onClick={() => navigateToProfile(following?.email)} sx={{ pl: 4 }}>
                                        <ListItemAvatar>
                                            <Avatar src={following?.profilePicture}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={following?.email} />
                                    </ListItemButton>
                                )) : <></>}
                            </List>
                        </TabPanel>
                    </Box>
                </TabContext>
            </>)
}

export default ProfileDetailBox