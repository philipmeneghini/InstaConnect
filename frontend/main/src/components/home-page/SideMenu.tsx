import { Avatar, Box, Button, Collapse, Divider, IconButton, List, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import React, { useContext } from 'react'
import { UserContext } from '../context-provider/UserProvider'
import useProfilePicture from '../../hooks/useProfilePicture'
import { FollowContents } from './Header'

interface sideMenuProps {
    handleDrawerClose : () => void,
    handleFollowingClick : () => void,
    handleFollowersClick : () => void,
    handleLogout : () => void,
    navigateToProfile : (email: string) => void,
    followers : FollowContents[],
    following : FollowContents[],
    followingOpen : boolean,
    followersOpen : boolean
}

const SideMenu = (props: sideMenuProps) => {

    const { user } = useContext(UserContext)
    const [ profilePicture ] = useProfilePicture(user?.profilePictureUrl)

    return (
        <Box sx={{ overflow: 'hidden', displaywidth: '20vw'}}>
            <Box sx={{height: '10vh'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <IconButton onClick={props.handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Box>
                <Divider />
            </Box>
            <Box sx={{height:'80vh'}}>
                <List component='nav' sx={{paddingTop: '0', height: '90vh'}}>
                    <ListItemButton onClick={props.handleFollowingClick} sx={{paddingRight: '0', display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem'}}>
                        Following
                        <ListItemIcon>
                            {props.followingOpen? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </ListItemIcon>
                    </ListItemButton>
                    <Collapse in={props.followingOpen} timeout='auto' unmountOnExit>
                        <List sx={{overflowY: 'auto', maxHeight: '65vh'}} component='div' disablePadding>
                            {props.following.map(following => (
                                <ListItemButton key={following.email} onClick={() => props.navigateToProfile(following.email)} sx={{ pl: 4 }}>
                                    <ListItemAvatar>
                                        <Avatar src={following.profilePicture}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={following.email} />
                                </ListItemButton>))}
                        </List>
                    </Collapse>
                    <ListItemButton onClick={props.handleFollowersClick} sx={{paddingRight: '0', display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem'}}>
                        Followers
                        <ListItemIcon>
                            {props.followersOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </ListItemIcon>
                    </ListItemButton>
                    <Collapse in={props.followersOpen} timeout="auto" unmountOnExit>
                        <List sx={{overflowY: 'auto', maxHeight: '65vh'}} component="div" disablePadding>
                            {props.followers.map(follower => (
                                <ListItemButton key={follower.email} onClick={() => props.navigateToProfile(follower.email)} sx={{ pl: 4 }}>
                                    <ListItemAvatar>
                                        <Avatar src={follower.profilePicture}/> 
                                    </ListItemAvatar>
                                    <ListItemText primary={ follower.email} />
                                </ListItemButton>))}
                        </List>
                    </Collapse>
                </List>
            </Box>
            <Box sx={{height: '10vh'}}>
                <Divider/>
                <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    p: 1.5,
                    pb: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
                >
                    <Avatar src={profilePicture}/>
                    <div>
                        <Typography>{user?.firstName} {user?.lastName}</Typography>
                        <Button onClick={props.handleLogout} variant='text' size='small' sx={{color: 'black'}}>
                            Logout
                        </Button>
                    </div>
                </Box>
            </Box>
        </Box>
        
    )
}
export default SideMenu