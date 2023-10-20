import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { CommentModel, ContentModel, UserModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, Checkbox, IconButton, Paper, Tab, Typography } from '@mui/material'
import AddCommentIcon from '@mui/icons-material/AddComment'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { UserContents } from '../../pages/home-page/HomePage'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Favorite, FavoriteBorder } from '@mui/icons-material'

const interactionToolbarStyle = {
    paddingTop: '1vh',
    display: 'flex',
    justifyContent: 'center',
}

interface PostContentProps {
    userContent: UserContents
    user: UserModel
}

export const PostContentBox = ( props: PostContentProps ) => {

    const [ comments, setComments ] = useState<CommentModel[]>([])
    const [ userLikes, setUserLikes ] = useState<UserModel[]>([])
    const [ contentExpanded, setContentExpanded ] = useState<boolean>(false)
    const [ menuSelection, setMenuSelection ] = useState<string>('comments')
    const [ content, setContent ] = useState<ContentModel>(props?.userContent?.content)

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

    }, [contentExpanded, content])

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
            if (newLikes === undefined) {
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
            return
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

    return (<Paper elevation={24} sx={{margin: '2vh 0', width: '40vw', padding: '2% 0 1%'}}>
                <Box sx={{display:'flex', justifyContent: 'space-between', marginBottom: '2vh'}}>
                    <Box sx={{display:'flex', justifyContent: 'space-between', marginLeft: '2%'}}>
                        <Avatar src={props?.userContent?.user?.profilePictureUrl} sx={{ width: '5vh', height: '5vh'}}/>
                        <Typography sx={{margin: '0.5vh 0 0.5vh 1vh'}}> {props?.userContent?.user?.firstName} {props?.userContent?.user?.lastName} </Typography>
                    </Box>
                </Box>
                <img
                    src={content.mediaUrl}
                    srcSet={content.mediaUrl}
                    alt={content.caption}
                    loading='lazy'
                    style={{maxWidth: '38vw'}}
                />
                <Box sx={interactionToolbarStyle}>
                    <Box sx={{paddingRight: '5vw', display: 'flex', justifyContent: 'center'}}>
                        <Checkbox onClick={handleLike} checked={isContentLiked()} sx={{paddingTop: '0',display: 'inline'}} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                        <Typography paddingLeft={'0.5vw'}> {content?.likes?.length ?? 0} likes</Typography>
                    </Box>
                    <Box sx={{paddingLeft: '5vw', display: 'flex', justifyContent: 'center'}}>
                        <IconButton sx={{maxHeight: '3vh'}} size='small' onClick={handleLike}>
                            <AddCommentIcon/>
                        </IconButton>
                    <Typography paddingLeft={'0.5vw'}> {comments.length} comments</Typography>
                    </Box>
                </Box>
                <Typography paddingTop='1vh'> {content.caption} </Typography>
                { contentExpanded ?
                    <Box sx={{marginTop: '2vh'}}>
                        <TabContext value={menuSelection}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label='Comments' value='comments' />
                                    <Tab label="Likes" value='likes' />
                                </TabList>
                            </Box>
                            <TabPanel value='comments'>
                                {comments.map( (comment) => (
                                <Typography key={comment?.contentId} sx={{display: 'flex', justifyContent: 'left', marginLeft: '2%'}}>
                                    <strong>{comment?.email}: </strong> {comment?.body}
                                </Typography>
                                ))}
                            </TabPanel>
                            <TabPanel value='likes'>
                                {userLikes.map( (like) => (
                                <Typography key={like?.email} sx={{marginLeft: '10vw'}}>
                                    <Avatar src={like.profilePictureUrl} sx={{ width: '5vh', height: '5vh'}}/>
                                    <strong> {like.email} </strong>
                                </Typography>
                                ))}
                            </TabPanel>
                         </TabContext> 
                         <IconButton onClick={handleCloseDropdown}>
                            <KeyboardArrowUpIcon/>
                        </IconButton>   
                    </Box>
                : 
                <IconButton onClick={handleDropdown}>
                    <KeyboardArrowDownIcon/>
                </IconButton>}
                
        </Paper>)
}

export default PostContentBox