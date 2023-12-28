import { Avatar, Box, InputBase, Menu, MenuItem, Modal, Typography, alpha, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Paths } from '../../utils/Constants'
import { useNavigate } from 'react-router-dom'
import { ContentModel, UserModel } from '../../api/Client'
import { _apiClient } from '../../App'
import PostContentBox from './PostContentBox'
import { UserContents } from '../../pages/main-page/HomePage'
import useUser from '../../hooks/useUser'

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
  }))
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }))
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }))

const SearchBar = () => {

    const [ anchorSearch, setAnchorSearch ] = useState<HTMLElement | null>(null)
    const [ searchOpen, setSearchOpen ] = useState<boolean>(false)
    const [ usersSearch, setUsersSearch ] = useState<UserModel[]>([])
    const [ contentsSearch, setContentsSearch ] = useState<ContentModel[]>([])
    const [ contentOpen, setContentOpen ] = useState<ContentModel>()
    const [ contentUser, setContentUser ] = useState<UserModel>()

    const [ user ] = useUser()

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

    const navigateToProfile = (email: string) => {
        if (email) {
            if (email === user?.email) {
                navigate(Paths.Profile, {replace: true})
            }
            else {
                navigate({
                    pathname: Paths.Profile,
                    search: `?email=${email}`
                }, {replace: true})
            }
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

    return (
        <>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                placeholder='Search…'
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
            <Modal
            open={contentOpen ? true : false}
            onClose={handleContentClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            >
                <Box sx={postBoxStyle}>
                    <PostContentBox userContent={{user: contentUser as UserModel, content: contentOpen as ContentModel} as UserContents} user={user as UserModel} handleClose={handleContentClose}/>
                </Box>
            </Modal>
        </>
    )
}

export default SearchBar