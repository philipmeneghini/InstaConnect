import { Button, AppBar, Box, Collapse, Container, Divider, Drawer, Grid, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography, ListItemAvatar, styled, alpha, InputBase, Modal } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, { useEffect, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../utils/Constants'
import { ContentModel, UserModel } from '../../api/Client'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import useFollowers from '../../hooks/useFollowers'
import useProfilePicture from '../../hooks/useProfilePicture'
import SearchIcon from '@mui/icons-material/Search'
import { _apiClient } from '../../App'
import PostContentBox from './PostContentBox'
import { UserContents } from '../../pages/main-page/HomePage'

export interface FollowContents {
    email : string
    profilePicture : string | undefined
}

interface HeaderProps {
    user: UserModel
}

const postBoxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    maxHeight: '90vh',
    bgcolor: 'whitesmoke',
    border: '1px solid #000',
    p: '2vh',
    overflowY: 'auto',
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
    const [ anchorSearch, setAnchorSearch ] = useState<HTMLElement | null>(null)
    const [ menuOpen, setMenuOpen ] = useState<boolean>(false)
    const [ searchOpen, setSearchOpen ] = useState<boolean>(false)
    const [ usersSearch, setUsersSearch ] = useState<UserModel[]>([])
    const [ contentsSearch, setContentsSearch ] = useState<ContentModel[]>([])
    const [ contentOpen, setContentOpen ] = useState<ContentModel>()
    const [ contentUser, setContentUser ] = useState<UserModel>()
    const [ followersOpen, setFollowersOpen ] = useState<boolean>(false)
    const [ followingOpen, setFollowingOpen ] = useState<boolean>(false)

    const [ followers ] = useFollowers(props?.user?.followers, followersOpen)
    const [ following ] = useFollowers(props?.user?.following, followingOpen)
    const [ profilePicture ] = useProfilePicture(props?.user?.profilePictureUrl)

    useEffect(() => {
        const GetContentUser = async () => {
            if (contentOpen !== undefined && contentOpen !== null) {
                try {
                    const user = await  _apiClient.userGET(contentOpen?.email)
                    setContentUser(user)
                }
                catch {
                    setContentUser(undefined)
                }
            }
            else {
                setContentUser(undefined)
            }
        }

        GetContentUser()

    }, [contentOpen])

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
            handleSearchOpen(evt.target.value, evt.currentTarget)
        }
    }

    const handleSearchOpen = async (searchParam: string, target: HTMLElement) => {
        let users: UserModel[]
        let contents: ContentModel[]

        try {
            users = await  _apiClient.search(searchParam)
        }
        catch{
            users = []
        }

        try{
            contents = await _apiClient.search2(searchParam)
        }
        catch {
            contents = []
        }

        if (contents.length > 0 || users.length > 0) {
            setSearchOpen(true)
            setAnchorSearch(target)
        }
        else {
            setSearchOpen(false)
            setAnchorSearch(null)
        }
        setUsersSearch(users)
        setContentsSearch(contents)
    }

    const handleSearchClose = () => {
        setSearchOpen(false)
        setUsersSearch([])
        setContentsSearch([])
    }

    const openContent = (content: ContentModel) => {
        setContentOpen(content)
    }

    const handleContentClose = () => {
        setContentOpen(undefined)
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
        <>
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
                            <Menu
                            anchorEl={anchorSearch}
                            id='search-menu'
                            open={searchOpen}
                            onClose={handleSearchClose}
                            onClick={handleSearchClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                overflow: 'auto',
                                maxHeight: '80vh',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <Typography textAlign='center'> <strong> Users </strong> </Typography>
                                {usersSearch.map(user => 
                                    <MenuItem key={user?.id} onClick={() => navigateToProfile(user?.email)}>
                                        <Avatar src={user?.profilePictureUrl}/> {user?.firstName} {user?.lastName}
                                    </MenuItem>)}
                                <Typography textAlign='center'> <strong> Posts </strong> </Typography>
                                {contentsSearch.map(content => 
                                    <MenuItem key={content?.id} onClick={() => openContent(content)}>
                                        <Avatar src={content?.mediaUrl}/> {content?.caption}
                                    </MenuItem>)}
                            </Menu>
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
        <Modal
        open={contentOpen ? true : false}
        onClose={handleContentClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        >
            <Box sx={postBoxStyle}>
                <PostContentBox userContent={{user: contentUser as UserModel, content: contentOpen as ContentModel} as UserContents} user={props?.user} handleClose={handleContentClose}/>
            </Box>
        </Modal>
        </>
)}

export default Header