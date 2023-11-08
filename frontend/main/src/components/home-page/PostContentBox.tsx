import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { CommentModel, ContentModel, UserModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, Button, Checkbox, IconButton, InputAdornment, Tab, TextField, Typography } from '@mui/material'
import AddCommentIcon from '@mui/icons-material/AddComment'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { UserContents } from '../../pages/main-page/HomePage'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import SendIcon from '@mui/icons-material/Send'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../utils/Constants'


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

    const [ comments, setComments ] = useState<CommentModel[]>([])
    const [ userLikes, setUserLikes ] = useState<UserModel[]>([])
    const [ contentExpanded, setContentExpanded ] = useState<boolean>(false)
    const [ menuSelection, setMenuSelection ] = useState<string>('comments')
    const [ content, setContent ] = useState<ContentModel>(props?.userContent?.content)
    const [ newComment, setNewComment ] = useState<string>()

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

    const navigate = useNavigate()

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
        catch {
            console.log('caught exception')
            return
        }
    }

    const handleComment = () => {
        setMenuSelection('comments') 
        setContentExpanded(true)
    }

    const sendComment = async () => { 
        try {
            await _apiClient.commentPOST({ contentId: content.id, likes: [], body: newComment, email: props?.user?.email } as CommentModel)
            setNewComment('')
        }
        catch {
            console.log('error')
        }
    }

    const isContentLiked = (): boolean | undefined => {
        const index: number = content?.likes?.indexOf(props?.user?.email, 0) ?? -1
        if (index > -1) {
            return true
        }
        else {
            return false
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

    const navigateToProfile = () => {
        const email = props?.userContent?.user?.email
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

    return (<>
                <Box sx={{display:'flex', justifyContent: 'space-between', marginBottom: '2vh'}}>
                    <Box sx={{display:'flex', justifyContent: 'space-between', marginLeft: '2%'}}>
                        <Avatar src={props?.userContent?.user?.profilePictureUrl} sx={{ width: '5vh', height: '5vh'}}/>
                        <IconButton size='small' color='inherit' onClick={navigateToProfile}>
                            <Typography sx={{margin: '0.5vh 0 0.5vh 1vh'}}> {props?.userContent?.user?.firstName} {props?.userContent?.user?.lastName} </Typography>
                        </IconButton>
                    </Box>
                    { props?.handleClose ? <Button variant='contained' onClick={props?.handleClose}> Close </Button> : <></>}
                </Box>
                <img
                    src={content.mediaUrl}
                    srcSet={content.mediaUrl}
                    alt={content.caption}
                    loading='lazy'
                    style={{maxWidth: '38vw', display: 'flex', margin: 'auto'}}
                />
                <Box sx={interactionToolbarStyle}>
                    <Box sx={{paddingRight: '5vw', display: 'flex', justifyContent: 'center'}}>
                        <Checkbox onClick={handleLike} checked={isContentLiked()} sx={{paddingTop: '0',display: 'inline'}} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                        <Typography paddingLeft={'0.5vw'}> {content?.likes?.length ?? 0} likes</Typography>
                    </Box>
                    <Box sx={{paddingLeft: '5vw', display: 'flex', justifyContent: 'center'}}>
                        <IconButton sx={{maxHeight: '3vh'}} size='small' onClick={handleComment}>
                            <AddCommentIcon/>
                        </IconButton>
                    <Typography paddingLeft={'0.5vw'}> {comments.length} comments</Typography>
                    </Box>
                </Box>
                <Typography paddingTop='1vh' display='flex' justifyContent='center'> {content.caption} </Typography>
                { contentExpanded ?
                    <Box sx={{marginTop: '2vh'}}>
                        <TabContext value={menuSelection}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label='Comments' value='comments' />
                                    <Tab label="Likes" value='likes' />
                                </TabList>
                            </Box>
                            <Box sx={{overflow: 'auto', maxHeight: '30vh'}}>
                            <TabPanel value='comments'>
                                {comments.map( (comment) => (
                                <Typography key={comment?.id} sx={{display: 'flex', justifyContent: 'left', marginLeft: '1vw'}}>
                                    <strong>{comment?.email}: </strong> {comment?.body}
                                </Typography>
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
                                {userLikes.map( (like) => (
                                <Typography key={like?.email} sx={{marginLeft: '10vw'}}>
                                    <Avatar src={like.profilePictureUrl} sx={{ width: '5vh', height: '5vh'}}/>
                                    <strong> {like.email} </strong>
                                </Typography>
                                ))}
                            </TabPanel>
                            </Box>
                         </TabContext>
                         <Box sx={{display: 'flex', justifyContent: 'center'}}> 
                            <IconButton onClick={handleCloseDropdown}>
                                <KeyboardArrowUpIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                :
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <IconButton onClick={handleDropdown}>
                        <KeyboardArrowDownIcon/>
                    </IconButton>
                </Box>}
                </>)
}

export default PostContentBox