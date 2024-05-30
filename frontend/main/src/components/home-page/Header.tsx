import { AppBar, Container, Drawer, Grid, Menu, MenuItem, Toolbar, Typography, Badge } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, { useContext, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../utils/Constants'
import { UserModel } from '../../api/Client'
import useFollowers from '../../hooks/useFollowers'
import useProfilePicture from '../../hooks/useProfilePicture'
import SearchBar from './SearchBar'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { UserContext } from '../context-provider/UserProvider'
import { ToastContext } from '../context-provider/ToastProvider'
import { NotificationContext } from '../context-provider/NotificationProvider'
import Notifications from './Notifications'
import SideMenu from './SideMenu'

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
    const toastContext = useContext(ToastContext)
    const { unReadNotifications } = useContext(NotificationContext)
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
        toastContext.openToast(true, 'Successfully logged out!')
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
                                <SideMenu 
                                handleDrawerClose={handleDrawerClose}
                                handleFollowersClick={handleFollowersClick}
                                handleFollowingClick={handleFollowingClick}
                                handleLogout={handleLogout}
                                navigateToProfile={navigateToProfile}
                                followers={followers}
                                following={following}
                                followersOpen={followersOpen}
                                followingOpen={followingOpen}/>
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