import { Button, AppBar, Box, Collapse, Container, DialogContent, DialogTitle, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, { useEffect, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../utils/Constants'
import { UserModel } from '../../api/Client'
import axios from 'axios'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

const sideBarBoxStyling = {
    maxWidth: '30vw',
    color: 'black',
    overflow: 'hidden',
}

interface HeaderProps {
    user: UserModel
}

export const Header = ( props: HeaderProps ) => {

    const [ anchorUser, setAnchorUser ] = useState<HTMLElement | null>(null)
    const [ menuOpen, setMenuOpen ] = useState<boolean>(false)
    const [ profilePicture, setProfilePicture ] = useState<string>(props.user.profilePictureUrl ?? '')
    const [ followersOpen, setFollowersOpen ] = useState<boolean>(false)
    const [ followingOpen, setFollowingOpen ] = useState<boolean>(false)

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
        validateUrl(props.user.profilePictureUrl as string)
    }, [props])

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
        localStorage.removeItem('token')
        navigate(Paths['Login'], { replace: true })
    }

    const handleMenuItemClick = () => {
        setMenuOpen(true)
    }

    const handleMenuClose = () => {
        setMenuOpen(false)
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

    const sideMenu = () => (
        <Box sx={{ overflow: 'hidden', displaywidth: '20vw'}}>
            <Box sx={{height: '10vh'}}>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <IconButton onClick={handleMenuClose}>
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
                    <Collapse in={followingOpen} timeout="auto" unmountOnExit>
                        <List sx={{overflowY: 'auto', maxHeight: '65vh'}} component="div" disablePadding>
                            {props.user.following?.map(following => (
                                <ListItemButton key={following} onClick={() => navigateToProfile(following)} sx={{ pl: 4 }}>
                                    <ListItemText primary={following} />
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
                            {props.user.followers?.map(follower => (
                                <ListItemButton key={follower} onClick={() => navigateToProfile(follower)} sx={{ pl: 4 }}>
                                    <ListItemText primary={follower} />
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
                                    onClose={() => setMenuOpen(false)}
                                    sx={{ backgroundColor: '' }}
                                    PaperProps={{
                                        sx: {
                                            borderRight: '0.1vw solid black',
                                            backgroundColor: '#e6e6e6',
                                            //boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                                        }
                                      }}
                                > 
                                    {sideMenu()}
                                </Drawer>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton color='inherit' onClick={handleInstaConnectClick}>
                                <Typography variant='h4'>
                                        InstaConnect
                                </Typography>
                            </IconButton>
                        </Grid>
                        <Grid item xs={5} sx={{ flexGrow: 0, display: 'flex', justifyContent: 'end'}}>
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