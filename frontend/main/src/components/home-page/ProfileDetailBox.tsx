import { useState } from 'react'
import { UserModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, Button, Grid, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Tab, Typography } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../utils/Constants'
import useLazyProfiles from '../../hooks/useLazyProfiles'

interface ProfileDetailProps {
    profile: UserModel
    user: UserModel
    handleClose?: (() => void) | undefined
}

export const ProfileDetailBox = ( props: ProfileDetailProps ) => {

    const [ menuSelection, setMenuSelection ] = useState<string>('followers')

    const [ followersRef, followers ] = useLazyProfiles('Failed to load followers!', 10, props?.profile?.followers ?? [])
    const [ followingRef, followings ] = useLazyProfiles('Failed to load following!', 10, props?.profile?.following ?? [])

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
                        <Avatar src={props?.profile?.profilePictureUrl} sx={{ width: '5vh', height: '5vh'}}/>
                        <IconButton size='small' color='inherit' onClick={() => navigateToProfile(props?.profile?.email)}>
                            <Typography sx={{margin: '0.5vh 0 0.5vh 1vh'}}> {props?.profile?.firstName} {props?.profile?.lastName} </Typography>
                        </IconButton>
                    </Box>
                    { props?.handleClose ? <Button variant='contained' onClick={props?.handleClose}> Close </Button> : <></>}
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <img
                        style={{maxHeight: '30vh', maxWidth: '100%'}}
                        src={props?.profile?.profilePictureUrl}
                        srcSet={props?.profile?.profilePictureUrl}
                        alt='profile'
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Grid item xs container direction='column' spacing={2}>
                            <Grid item xs>
                                <Typography><b>Name:</b> {props?.profile?.firstName} {props?.profile?.lastName}</Typography>            
                            </Grid>
                            <Grid item xs>
                                <Typography><b>Email:</b> {props?.profile?.email}</Typography>        
                            </Grid>
                            <Grid item xs>
                                <Typography><b>Birthdate:</b> {props?.profile?.birthDate}</Typography>
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
                    <Box sx={{overflowY: 'auto', maxHeight: '30vh'}}>
                        <TabPanel value='followers'>
                            <List sx={{ maxHeight: '65vh'}} component="div" disablePadding>
                                {followers ? followers.map( (follower, index) => (
                                    (index === (followers.length - 1))
                                    ?
                                    <ListItemButton ref={followersRef} key={follower?.email} onClick={() => navigateToProfile(follower?.email)} sx={{ pl: 4 }}>
                                        <ListItemAvatar>
                                            <Avatar src={follower?.profilePictureUrl}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={follower?.email} />
                                    </ListItemButton>
                                    :
                                    <ListItemButton key={follower?.email} onClick={() => navigateToProfile(follower?.email)} sx={{ pl: 4 }}>
                                        <ListItemAvatar>
                                            <Avatar src={follower?.profilePictureUrl}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={follower?.email} />
                                    </ListItemButton>
                                )) : <></>}
                            </List>
                        </TabPanel>
                        <TabPanel value='following'>
                        <List sx={{ maxHeight: '65vh'}} component="div" disablePadding>
                                {followings ? followings.map( (following, index) => (
                                    (index === (followings.length - 1))
                                    ?
                                    <ListItemButton ref={followingRef} key={following?.email} onClick={() => navigateToProfile(following?.email)} sx={{ pl: 4 }}>
                                        <ListItemAvatar>
                                            <Avatar src={following?.profilePictureUrl}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={following?.email} />
                                    </ListItemButton>
                                    :
                                    <ListItemButton key={following?.email} onClick={() => navigateToProfile(following?.email)} sx={{ pl: 4 }}>
                                        <ListItemAvatar>
                                            <Avatar src={following?.profilePictureUrl}/>
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