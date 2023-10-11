import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { CommentModel, ContentModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, IconButton, Paper, Typography } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AddCommentIcon from '@mui/icons-material/AddComment'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { UserContents } from '../../pages/home-page/HomePage'

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
    const [ contentExpanded, setContentExpanded ] = useState<boolean>(false)

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

    }, [contentExpanded === true])

    const handleLike = () => { }
    const handleDropdown = () => { 
        setContentExpanded(true)
    }
    const handleCloseDropdown = () => { 
        setContentExpanded(false)
     }

    return (<Paper elevation={24} sx={{margin: '2vh 0', width: '40vw', padding: '2% 0'}}>
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
                        <Typography paddingLeft={'0.5vw'}> {props?.userContent?.content?.likes} likes</Typography>
                    </Box>
                    <Box sx={{paddingLeft: '5vw', display: 'flex', justifyContent: 'center'}}>
                        <IconButton sx={{maxHeight: '3vh'}} size='small' onClick={handleLike}>
                            <AddCommentIcon/>
                        </IconButton>
                    <Typography paddingLeft={'0.5vw'}> 5 comments</Typography>
                    </Box>
                </Box>
                <Typography paddingTop='1vh'> {props?.userContent?.content?.caption} </Typography>
                { contentExpanded ?
                    <Box sx={{marginTop: '2vh'}}>
                        {comments.map( (comment) => (
                            <Typography sx={{display: 'flex', justifyContent: 'left', marginLeft: '2%'}}>
                                <strong>{comment?.email}: </strong> {comment?.body}
                            </Typography>
                        ))}
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