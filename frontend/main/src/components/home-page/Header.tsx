import { AppBar, Box, Container, Divider, Drawer, Grid, List, ListItem, ListItemText, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
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

const sideBarBoxStyling = {
    maxWidth: '30vw',
    marginTop: '10vh',
    p: '2vh',
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
        navigate(Paths['Login'], { replace: true })
    }

    const handleMenuItemClick = () => {
        setMenuOpen(!menuOpen)
    }

    const handleInstaConnectClick = () => {
        navigate(Paths['Home'], { replace: true })
    }

    const sideMenu = () => (
        <Box sx={sideBarBoxStyling}>
            <Typography variant='h4' sx={{ padding: '1vh 0 2vh 0' }}> {props.user.firstName} {props.user.lastName} </Typography>
            <Divider sx={{ backgroundColor: 'black' }}/>
            <Typography variant='h5' sx={{ paddingTop: '1vh' }}> Followers </Typography>
            <List>
                {props.user.followers?.map(follower => (
                    <ListItem>
                        <ListItemText primary={follower}/>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ backgroundColor: 'black' }}/>
            <Typography variant='h5' sx={{ paddingTop: '1vh' }}> Following </Typography>
            <List>
                {props.user.following?.map(following => (
                    <ListItem>
                        <ListItemText primary={following}/>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ backgroundColor: 'black' }}/>
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
                                <Drawer
                                    anchor={'left'}
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
                            </IconButton>
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