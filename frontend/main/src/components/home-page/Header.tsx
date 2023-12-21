import { Button, AppBar, Box, Collapse, Container, Divider, Drawer, Grid, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography, ListItemAvatar, styled, alpha, InputBase } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, { useState } from 'react'
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
import SearchIcon from '@mui/icons-material/Search'

export interface FollowContents {
    email : string
    profilePicture : string | undefined
}

interface HeaderProps {
    user: UserModel
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '60%',
    height: '70%',
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));
  

export const Header = ( props: HeaderProps ) => {

    const [ anchorUser, setAnchorUser ] = useState<HTMLElement | null>(null)
    const [ menuOpen, setMenuOpen ] = useState<boolean>(false)
    const [ followersOpen, setFollowersOpen ] = useState<boolean>(false)
    const [ followingOpen, setFollowingOpen ] = useState<boolean>(false)

    const [ followers ] = useFollowers(props?.user?.followers, followersOpen)
    const [ following ] = useFollowers(props?.user?.following, followingOpen)
    const [ profilePicture ] = useProfilePicture(props?.user?.profilePictureUrl)

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

    const handleKeyPress = (evt: any) => {
        if (evt.key === 'Enter') {
            console.log(evt.target.value)
        }
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
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                onKeyDown={handleKeyPress}
                                />
                            </Search>
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