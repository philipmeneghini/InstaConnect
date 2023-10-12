import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { CommentModel, ContentModel, UserModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, IconButton, Paper, Tab, Typography } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AddCommentIcon from '@mui/icons-material/AddComment'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { UserContents } from '../../pages/home-page/HomePage'
import { TabContext, TabList, TabPanel } from '@mui/lab'

const interactionToolbarStyle = {
    paddingTop: '1vh',
    display: 'flex',
    justifyContent: 'center',
}

interface PostContentProps {
    userContent: UserContents
}

export const PostContentBox = ( props: PostContentProps ) => {

    const [ comments, setComments ] = useState<CommentModel[]>([])
    const [ userLikes, setUserLikes ] = useState<UserModel[]>([])
    const [ contentExpanded, setContentExpanded ] = useState<boolean>(false)
    const [ menuSelection, setMenuSelection ] = useState<string>('comments')

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

        getComments(props?.userContent?.content)

    }, [contentExpanded === true, props?.userContent?.content])

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
        
        getUserLikes(props?.userContent?.content?.likes)

    }, [contentExpanded === true, props?.userContent?.content?.likes])

    const handleLike = () => { }
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
                    src={props?.userContent?.content?.mediaUrl}
                    srcSet={props?.userContent?.content?.mediaUrl}
                    alt={props?.userContent?.content?.caption}
                    loading='lazy'
                    style={{maxWidth: '38vw'}}
                />
                <Box sx={interactionToolbarStyle}>
                    <Box sx={{paddingRight: '5vw', display: 'flex', justifyContent: 'center'}}>
                        <IconButton sx={{maxHeight: '3vh'}} size='small' onClick={handleLike}>
                            <FavoriteBorderIcon/>
                        </IconButton>
                        <Typography paddingLeft={'0.5vw'}> {props?.userContent?.content?.likes?.length ?? 0} likes</Typography>
                    </Box>
                    <Box sx={{paddingLeft: '5vw', display: 'flex', justifyContent: 'center'}}>
                        <IconButton sx={{maxHeight: '3vh'}} size='small' onClick={handleLike}>
                            <AddCommentIcon/>
                        </IconButton>
                    <Typography paddingLeft={'0.5vw'}> {comments.length} comments</Typography>
                    </Box>
                </Box>
                <Typography paddingTop='1vh'> {props?.userContent?.content?.caption} </Typography>
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
                                <Typography sx={{display: 'flex', justifyContent: 'left', marginLeft: '2%'}}>
                                    <strong>{comment?.email}: </strong> {comment?.body}
                                </Typography>
                                ))}
                            </TabPanel>
                            <TabPanel value='likes'>
                                {userLikes.map( (like) => (
                                <Typography sx={{marginLeft: '10vw'}}>
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