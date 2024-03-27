import { Button, AppBar, Box, Collapse, Container, Divider, Drawer, Grid, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography, ListItemAvatar, Badge } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, { useContext, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../utils/Constants'
import { UserModel } from '../../api/Client'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import useFollowers from '../../hooks/useFollowers'
import useProfilePicture from '../../hooks/useProfilePicture'
import SearchBar from './SearchBar'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { UserContext } from '../context-provider/UserProvider'
import { NotificationContext } from '../context-provider/NotificationProvider'
import { WebSocketContext } from '../context-provider/WebSocketProvider'
import Notifications from './Notifications'

export interface FollowContents {
    email : string
    profilePicture : string | undefined
}

interface HeaderProps {
    user: UserModel
}

export const Header = ( props: HeaderProps ) => {

    const [ anchorUser, setAnchorUser ] = useState<HTMLElement | null>(null)
    const [ anchorNotification, setAnchorNoticiation ] = useState<HTMLElement | null>(null)
    const [ menuOpen, setMenuOpen ] = useState<boolean>(false)
    const [ followersOpen, setFollowersOpen ] = useState<boolean>(false)
    const [ followingOpen, setFollowingOpen ] = useState<boolean>(false)

    const [ followers ] = useFollowers(props?.user?.followers, followersOpen)
    const [ following ] = useFollowers(props?.user?.following, followingOpen)
    const [ profilePicture ] = useProfilePicture(props?.user?.profilePictureUrl)

    const userContext = useContext(UserContext)
    const notificationContext = useContext(NotificationContext)
    const { notifications, unReadNotifications } = useContext(WebSocketContext)
    const navigate = useNavigate()

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorUser(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorUser(null)
    }

    const handleOpenProfilePage = () => {
        setAnchorUser(null)
        navigate(Paths['Profile'], { replace: true })
    }

    const handleLogout = () => {
        setAnchorUser(null)
        userContext.updateToken(null)
        navigate(Paths['Login'], { replace: true })
        notificationContext.openNotification(true, 'Successfully logged out!')
    }

    const handleMenuItemClick = () => {
        setMenuOpen(true)
    }

    const handleDrawerClose = () => {
        setMenuOpen(false)
        setFollowersOpen(false)
        setFollowingOpen(false)
    }

    const handleInstaConnectClick = () => {
        navigate(Paths['Home'], { replace: true })
    }

    const handleFollowingClick = () => {
        setFollowersOpen(false)
        setFollowingOpen(!followingOpen)
    }

    const handleFollowersClick = () => {
        setFollowingOpen(false)
        setFollowersOpen(!followersOpen)
    }

    const navigateToProfile = (email: string) => {
        if (email) {
            navigate({
                pathname: Paths.Profile,
                search: `?email=${email}`
            }, {replace: true})
            setMenuOpen(false)
        }
    }

    const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorNoticiation(event.currentTarget)
    }

    const handleCloseNotifications = () => {
        setAnchorNoticiation(null)
    }

    const sideMenu = () => (
        <Box sx={{ overflow: 'hidden', displaywidth: '20vw'}}>
            <Box sx={{height: '10vh'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Box>
                <Divider />
            </Box>
            <Box sx={{height:'80vh'}}>
                <List component='nav' sx={{paddingTop: '0', height: '90vh'}}>
                    <ListItemButton onClick={handleFollowingClick} sx={{paddingRight: '0', display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem'}}>
                        Following
                        <ListItemIcon>
                            {followingOpen? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </ListItemIcon>
                    </ListItemButton>
                    <Collapse in={followingOpen} timeout='auto' unmountOnExit>
                        <List sx={{overflowY: 'auto', maxHeight: '65vh'}} component='div' disablePadding>
                            {following.map(following => (
                                <ListItemButton key={following.email} onClick={() => navigateToProfile(following.email)} sx={{ pl: 4 }}>
                                    <ListItemAvatar>
                                        <Avatar src={following.profilePicture}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={following.email} />
                                </ListItemButton>))}
                        </List>
                    </Collapse>
                    <ListItemButton onClick={handleFollowersClick} sx={{paddingRight: '0', display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem'}}>
                        Followers
                        <ListItemIcon>
                            {followersOpen ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </ListItemIcon>
                    </ListItemButton>
                    <Collapse in={followersOpen} timeout="auto" unmountOnExit>
                        <List sx={{overflowY: 'auto', maxHeight: '65vh'}} component="div" disablePadding>
                            {followers.map(follower => (
                                <ListItemButton key={follower.email} onClick={() => navigateToProfile(follower.email)} sx={{ pl: 4 }}>
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
                        <Typography>{props?.user?.firstName} {props?.user?.lastName}</Typography>
                        <Button onClick={handleLogout} variant='text' size='small' sx={{color: 'black'}}>
                            Logout
                        </Button>
                    </div>
                </Box>
            </Box>
        </Box>
    )

    return (
        <AppBar component='nav' position='fixed'>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Grid container>
                        <Grid item xs = {5} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'start' }}>
                            <IconButton onClick={handleMenuItemClick} color='inherit'>
                                {menuOpen ? <MenuOpenIcon/> : <MenuIcon/>}
                            </IconButton>
                            <Drawer
                                anchor='left'
                                variant='persistent'
                                open={menuOpen}
                                onClose={handleDrawerClose}
                                sx={{ backgroundColor: '' }}
                                PaperProps={{
                                    sx: {
                                        borderRight: '0.1vw solid black',
                                        backgroundColor: '#e6e6e6',
                                    }
                                    }}
                            > 
                                {sideMenu()}
                            </Drawer>
                            <SearchBar/>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton color='inherit' onClick={handleInstaConnectClick}>
                                <Typography variant='h4'>
                                        InstaConnect
                                </Typography>
                            </IconButton>
                        </Grid>
                        <Grid item xs={5} sx={{ flexGrow: 0, display: 'flex', justifyContent: 'end'}}>
                            <Tooltip title='Notifications'>
                                <IconButton onClick={handleOpenNotifications}>
                                    <Badge color='secondary' badgeContent={unReadNotifications}>
                                        <NotificationsIcon sx={{color: '#DEC20B'}}/>
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Notifications anchor={anchorNotification} handleClose={handleCloseNotifications}/>
                            <Tooltip title='Open Settings'>
                                <IconButton onClick={handleOpenUserMenu}>
                                    <Avatar alt='Remy Sharp' src={profilePicture}/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                            sx={{ mt: '45px' }}
                            id='menu-appbar'
                            anchorEl={anchorUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorUser)}
                            onClose={handleCloseUserMenu}
                            >
                                <MenuItem key='Profile' onClick={handleOpenProfilePage}>
                                    <Typography textAlign='center'> Profile </Typography>
                                </MenuItem>
                                <MenuItem key='Account' onClick={handleCloseUserMenu}>
                                    <Typography textAlign='center'> Account </Typography>
                                </MenuItem>
                                <MenuItem key='Logout' onClick={handleLogout}>
                                    <Typography textAlign='center'> Logout </Typography>
                                </MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>
                </Toolbar>
            </Container>
        </AppBar>
)}

export default Header