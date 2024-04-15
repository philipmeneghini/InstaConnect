import { useContext, useEffect, useMemo, useState } from 'react'
import { _apiClient } from '../../App'
import { CommentModel, ContentModel, UserModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, Button, Checkbox, Grid, IconButton, InputAdornment, List, ListItemAvatar, ListItemButton, ListItemText, Modal, Tab, TextField, Tooltip, Typography } from '@mui/material'
import AddCommentIcon from '@mui/icons-material/AddComment'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { UserContents } from '../../pages/main-page/HomePage'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import SendIcon from '@mui/icons-material/Send'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../utils/Constants'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import DeleteConfirmation from './DeleteConfirmation'
import EditOffIcon from '@mui/icons-material/EditOff'
import Comment from './Comment'
import { ToastContext } from '../context-provider/ToastProvider'

const postBoxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30vw',
    maxHeight: '90vh',
    bgcolor: 'whitesmoke',
    border: '1px solid #000',
    p: '2vh',
    overflowY: 'auto',
}

const interactionToolbarStyle = {
    paddingTop: '1vh',
    display: 'flex',
    justifyContent: 'center',
}

interface PostContentProps {
    userContent: UserContents
    user: UserModel
    handleClose?: (() => void) | undefined
}

export const PostContentBox = ( props: PostContentProps ) => {

    const [ editMode, setEditMode ] = useState<boolean>(false)
    const [ comments, setComments ] = useState<CommentModel[]>([])
    const [ userLikes, setUserLikes ] = useState<UserModel[]>([])
    const [ caption, setCaption ] = useState<string>()
    const [ contentExpanded, setContentExpanded ] = useState<boolean>(false)
    const [ menuSelection, setMenuSelection ] = useState<string>('comments')
    const [ content, setContent ] = useState<ContentModel>(props?.userContent?.content)
    const [ newComment, setNewComment ] = useState<string>()
    const [ deleting, setDeleting ] = useState<boolean>(false)
    const toastContext = useContext(ToastContext)

    const isContentLiked = useMemo((): boolean | undefined => {
        const index: number = content?.likes?.indexOf(props?.user?.email, 0) ?? -1
        if (index > -1) {
            return true
        }
        else {
            return false
        }
    }, [props, content])

    useEffect(() => {
        const getComments = async (content: ContentModel) => {
            try {
                const response = await _apiClient.commentsGET(content.id)
                setComments(response)
            }
            catch {
                setComments([])
            }
        }     

        getComments(content)

    }, [contentExpanded, content, newComment])

    useEffect(() => {
        const getUserLikes = async (emails: string[] | undefined) => {
            try {
                const response = await _apiClient.usersGET(emails)
                setUserLikes(response)
            }
            catch {
                setUserLikes([])
            }
        }
        
        getUserLikes(content.likes)

    }, [contentExpanded, content])

    const handleLike = async () => {
        try {
            let newContent: ContentModel = {...content}
            let newLikes: string[] | undefined = content?.likes
            if (newLikes === undefined || newLikes === null) {
                newLikes = [ props?.user?.email ]
            }
            else {
                const index: number = newLikes.indexOf(props?.user?.email, 0) ?? -1
                if (index > -1) {
                    newLikes.splice(index, 1)
                }
                else {
                    console.log(props?.user?.email)
                    newLikes.push(props?.user?.email)
                }
            }
            newContent.likes = newLikes
            await _apiClient.contentPUT(newContent)
            setContent(newContent)
        }
        catch(err: any) {
            toastContext.openToast(false, err.message)
        }
    }

    const navigate = useNavigate()

    const handleComment = () => {
        setMenuSelection('comments') 
        setContentExpanded(true)
    }

    const handleDelete = () => {
        setDeleting(true)
    }

    const sendComment = async () => { 
        try {
            await _apiClient.commentPOST({ contentId: content.id, likes: [], body: newComment, email: props?.user?.email } as CommentModel)
            setNewComment('')
        }
        catch(err: any) {
            toastContext.openToast(false, err.message)
        }
    }

    const handleDropdown = () => { 
        setContentExpanded(true)
    }

    const handleCloseDropdown = () => { 
        setContentExpanded(false)
    }

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setMenuSelection(newValue)
    }

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

    const handleCancelModal = () => {
        setDeleting(false)
    }

    const handleDeleteModal = async () => {
        try {
           await _apiClient.contentDELETE(props?.userContent?.content?.id)
            toastContext.openToast(true, 'Successfully deleted post!')
        }
        catch(err: any) {
            toastContext.openToast(false, err.message)
        }
        setDeleting(false)
        setTimeout(() => 
        { handleSuccessfulDelete() }, 
        3000)
    }

    const handleSuccessfulDelete = () => {
        if (props?.handleClose) {
            props?.handleClose()
        }
    }

    const handleEdit = () => { 
        if (editMode) {
            setEditMode(false)
            setCaption(undefined)
        }
        else {
            setEditMode(true)
            setCaption(content?.caption)
        }
    }

    const handleCaptionChange = (e: any) => {
        setCaption(e.target.value)
    }

    const handleSaveChanges = async () => {
        let newContent: ContentModel = { ...content,
                                        caption: caption}
        console.log(caption)
        console.log(newContent)
        try {
            await _apiClient.contentPUT(newContent)
            toastContext.openToast(true, 'Post Successfully Updated!')
            setTimeout(() => 
            { setContent(newContent) }, 
            3000)
        }
        catch {
            toastContext.openToast(false, 'Post Failed to Update!')
        }
        setEditMode(false)
    }

    return (<>
                <Box sx={{display:'flex', justifyContent: 'space-between', marginBottom: '2vh'}}>
                    <Box sx={{display:'flex', justifyContent: 'space-between', marginLeft: '2%'}}>
                        <Avatar src={props?.userContent?.user?.profilePictureUrl} sx={{ width: '5vh', height: '5vh'}}/>
                        <IconButton size='small' color='inherit' onClick={() => navigateToProfile(props?.userContent?.user?.email)}>
                            <Typography sx={{margin: '0.5vh 0 0.5vh 1vh'}}> {props?.userContent?.user?.firstName} {props?.userContent?.user?.lastName} </Typography>
                        </IconButton>
                    </Box>
                    <Box>
                        { props?.user?.email === props?.userContent?.user?.email ? 
                            <>
                                <IconButton sx={{marginRight: '1vw'}} size='small' onClick={handleEdit}>
                                    <Tooltip title={editMode ? 'Stop Editing Post' : 'Edit Post'}>
                                        {editMode ? <EditOffIcon/> : <EditIcon/> }
                                    </Tooltip>
                                </IconButton>
                                <IconButton sx={{marginRight: '1vw'}} size='small' onClick={handleDelete}>
                                    <Tooltip title='Delete Post'>
                                        <DeleteForeverIcon sx={{color: 'red'}}/> 
                                    </Tooltip>
                                </IconButton>
                            </>: <></> }
                        { props?.handleClose ? <Button variant='contained' onClick={props?.handleClose}> Close </Button> : <></>}
                    </Box>
                </Box>
                <img
                    src={content.mediaUrl}
                    srcSet={content.mediaUrl}
                    alt={content.caption}
                    loading='lazy'
                    style={{maxWidth: '38vw', maxHeight: '30vh', display: 'flex', margin: 'auto'}}
                />
                <Box sx={interactionToolbarStyle}>
                    <Box sx={{paddingRight: '5vw', display: 'flex', justifyContent: 'center'}}>
                        <Checkbox onClick={handleLike} checked={isContentLiked} sx={{paddingTop: '0',display: 'inline'}} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                        <Typography paddingLeft={'0.5vw'}> {content?.likes?.length ?? 0} likes</Typography>
                    </Box>
                    <Box sx={{paddingLeft: '5vw', display: 'flex', justifyContent: 'center'}}>
                        <IconButton sx={{maxHeight: '3vh'}} size='small' onClick={handleComment}>
                            <AddCommentIcon/>
                        </IconButton>
                    <Typography paddingLeft={'0.5vw'}> {comments.length} comments</Typography>
                    </Box>
                </Box>
                {editMode ? 
                <TextField sx={{display: 'flex', justifyContent: 'center'}} 
                    variant='standard' 
                    onChange={handleCaptionChange}
                    value={caption}
                    multiline/> 
                : <Typography paddingTop='1vh' display='flex' justifyContent='center'> {content.caption} </Typography>}
                { contentExpanded ?
                    <Box sx={{marginTop: '2vh'}}>
                        <TabContext value={menuSelection}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange}>
                                    <Tab label='Comments' value='comments' />
                                    <Tab label="Likes" value='likes' />
                                </TabList>
                            </Box>
                            <Box sx={{overflow: 'auto', maxHeight: '30vh'}}>
                            <TabPanel value='comments'>
                                {comments.map( (comment) => (
                                    <Comment key={comment?.id} comment={comment}/>
                                ))}
                                <TextField
                                sx={{display: 'flex', justifyContent: 'left', marginLeft: '0.8vw', marginTop: '3vh'}}
                                label={props?.user?.email}
                                value={newComment}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Avatar src={props?.user?.profilePictureUrl} sx={{ width: '4vh', height: '4vh'}}/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <IconButton sx={{maxHeight: '3vh'}} size='small' onClick={sendComment}>
                                            <SendIcon sx={{color: 'blue'}}/>
                                        </IconButton>
                                    )
                                }}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setNewComment(event.target.value)}}
                                multiline
                                />
                            </TabPanel>
                            <TabPanel value='likes'>
                                <List sx={{overflowY: 'auto', maxHeight: '65vh'}} component="div" disablePadding>
                                    {userLikes.map( (like) => (
                                        <ListItemButton key={like?.email} onClick={() => navigateToProfile(like?.email)} sx={{ pl: 4 }}>
                                            <ListItemAvatar>
                                                <Avatar src={like?.profilePictureUrl}/>
                                            </ListItemAvatar>
                                            <ListItemText primary={like?.email} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </TabPanel>
                            </Box>
                         </TabContext>
                         <Grid container>
                            <Grid item xs={3}>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    <IconButton onClick={handleCloseDropdown}>
                                        <KeyboardArrowUpIcon/>
                                    </IconButton>
                                </div>
                            </Grid>
                            <Grid item xs={3}>
                                {editMode && <Button sx={{marginTop: '5%'}} variant='contained' onClick={handleSaveChanges}> Save Changes </Button>}
                            </Grid>
                        </Grid>
                    </Box>
                :
                <Grid container>
                    <Grid item xs={3}>
                    </Grid>
                    <Grid item xs={6}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <IconButton onClick={handleDropdown}>
                                <KeyboardArrowDownIcon/>
                            </IconButton>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        {editMode && <Button sx={{marginTop: '5%'}} variant='contained' onClick={handleSaveChanges}> Save Changes </Button>}
                    </Grid>
                </Grid>}
                <Modal
                open={deleting}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                >
                    <Box sx={postBoxStyle}>
                        <DeleteConfirmation handleCancel={handleCancelModal} handleDelete={handleDeleteModal}/>
                    </Box>
                </Modal>
            </>)
}

export default PostContentBox