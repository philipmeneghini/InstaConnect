import { Avatar, Box, Button, Collapse, Divider, IconButton, List, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import React, { useContext } from 'react'
import { UserContext } from '../context-provider/UserProvider'
import useProfilePicture from '../../hooks/useProfilePicture'
import useLazyProfiles from '../../hooks/useLazyProfiles'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(
    () => ({
        menuBox: {
            overflow: 'hidden', 
            displaywidth: '20vw'
        },
        closeBox: {
            height: '10vh' 
        },
        leftIconBox: {
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end'
        },
        mainBox: {
            height:'80vh'
        },
        followingsFollowersList: {
            paddingTop: '0', 
            height: '90vh'
        },
        followingFollowerButton: {
            paddingRight: '0', 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '1.4rem'
        },
        followingFollowerList: {
            overflowY: 'auto', 
            maxHeight: '65vh'
        },
        profileButton: {
            pl: 4
        },
        footerBox: {
            height: '10vh'
        },
        avatarBox: {
            display: 'flex',
            gap: 1,
            justifyContent: 'flex-start', 
            padding: '5px',
            borderTop: '1px solid',
            borderColor: 'divider',
        },
        textFooter: {
            paddingLeft: '5px'
        },
        closeButton: {
            color: 'black'
        }

}))

interface sideMenuProps {
    handleDrawerClose : () => void,
    handleFollowingClick : () => void,
    handleFollowersClick : () => void,
    handleLogout : () => void,
    navigateToProfile : (email: string) => void,
    followingOpen : boolean,
    followersOpen : boolean
}

const SideMenu = (props: sideMenuProps) => {

    const { user } = useContext(UserContext)
    const [ profilePicture ] = useProfilePicture(user?.profilePictureUrl)

    const [ followersRef, followers ] = useLazyProfiles('Failed to load followers', 10, user?.followers ?? [])
    const [ followingRef, followings ] = useLazyProfiles('Failed to load following', 10, user?.following ?? [])

    const {
        menuBox,
        closeBox,
        leftIconBox,
        mainBox,
        followingsFollowersList,
        followingFollowerButton,
        followingFollowerList,
        profileButton,
        footerBox,
        avatarBox,
        textFooter,
        closeButton,
    } = useStyles().classes

    return (
        <Box className={menuBox}>
            <Box className={closeBox}>
                <Box className={leftIconBox}>
                    <IconButton onClick={props.handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Box>
                <Divider />
            </Box>
            <Box className={mainBox}>
                <List component='nav' className={followingsFollowersList}>
                    <ListItemButton className={followingFollowerButton} onClick={props.handleFollowingClick} >
                        Following
                        <ListItemIcon>
                            {props.followingOpen? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </ListItemIcon>
                    </ListItemButton>
                    <Collapse in={props.followingOpen} timeout='auto' unmountOnExit>
                        <List className={followingFollowerList} component='div' disablePadding>
                            {followings.map((following, index) => (
                                (index === (followings.length - 1)) 
                                ? 
                                <ListItemButton className={profileButton} ref={followingRef} key={following.email} onClick={() => props.navigateToProfile(following.email)}>
                                    <ListItemAvatar>
                                        <Avatar src={following.profilePictureUrl}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={following.email} />
                                </ListItemButton>
                                :
                                <ListItemButton className={profileButton} key={following.email} onClick={() => props.navigateToProfile(following.email)}>
                                    <ListItemAvatar>
                                        <Avatar src={following.profilePictureUrl}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={following.email} />
                                </ListItemButton>))}
                        </List>
                    </Collapse>
                    <ListItemButton className={followingFollowerButton} onClick={props.handleFollowersClick}>
                        Followers
                        <ListItemIcon>
                            {props.followersOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </ListItemIcon>
                    </ListItemButton>
                    <Collapse in={props.followersOpen} timeout="auto" unmountOnExit>
                        <List className={followingFollowerList} component="div" disablePadding>
                            {followers.map((follower, index) => (
                                (index === (followers.length - 1))
                                ?
                                <ListItemButton ref={followersRef} className={profileButton} key={follower.email} onClick={() => props.navigateToProfile(follower.email)}>
                                    <ListItemAvatar>
                                        <Avatar src={follower.profilePictureUrl}/> 
                                    </ListItemAvatar>
                                    <ListItemText primary={ follower.email} />
                                </ListItemButton>
                                :
                                <ListItemButton className={profileButton} key={follower.email} onClick={() => props.navigateToProfile(follower.email)}>
                                    <ListItemAvatar>
                                        <Avatar src={follower.profilePictureUrl}/> 
                                    </ListItemAvatar>
                                    <ListItemText primary={ follower.email} />
                                </ListItemButton>))}
                        </List>
                    </Collapse>
                </List>
            </Box>
            <Box className={footerBox}>
                <Divider/>
                <Box className={avatarBox}>
                    <Avatar src={profilePicture}/>
                    <Box className={textFooter}>
                        <Typography>{user?.firstName} {user?.lastName}</Typography>
                        <Button className={closeButton} onClick={props.handleLogout} variant='text' size='small'>
                            Logout
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
        
    )
}
export default SideMenu