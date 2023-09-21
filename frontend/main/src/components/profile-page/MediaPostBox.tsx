import { ContentModel, UserModel } from '../../api/Client'
import React from 'react'
import {  Avatar, Box, Button, IconButton, Modal, Typography } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AddCommentIcon from '@mui/icons-material/AddComment'

const postBoxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    maxHeight: '80vh',
    bgcolor: 'whitesmoke',
    border: '2px solid #000',
    p: '2vh',
    overflow: 'hidden',
    overflowY: 'scroll',
}

const interactionToolbarStyle = {
    paddingTop: '1vh',
    display: 'flex',
    justifyContent: 'center',
}

interface MediaPostBoxProps {
    user: UserModel
    content: ContentModel | null
    setContent:  React.Dispatch<React.SetStateAction<ContentModel | null>>
    profilePicture: string | undefined
}

export const MediaPostBox = (props: MediaPostBoxProps) => {

    const handleClose = () => { props.setContent(null) }
    const handleLike = () => { }

    return (
        <Modal
            open={props.content ? true : false}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
        >
            <Box sx={postBoxStyle}>
                <Box sx={{display:'flex', justifyContent: 'space-between', marginBottom: '2vh'}}>
                    <Box sx={{display:'flex', justifyContent: 'space-between'}}>
                        <Avatar src={props.profilePicture} sx={{ width: '5vh', height: '5vh'}}/>
                        <Typography sx={{margin: '0.5vh 0 0.5vh 1vh'}}> {props.user.firstName} {props.user.lastName} </Typography>
                    </Box>
                    <Button variant='contained' onClick={handleClose}> Close </Button>
                </Box>
                <img
                    src={props.content?.mediaUrl}
                    srcSet={props.content?.mediaUrl}
                    alt={props.content?.caption}
                    loading='lazy'
                    style={{display: 'flex', margin: 'auto', width: '38vw'}}
                />
                <Box sx={interactionToolbarStyle}>
                    <Box sx={{paddingRight: '5vw', display: 'flex', justifyContent: 'center'}}>
                        <IconButton sx={{maxHeight: '3vh'}} size='small' onClick={handleLike}>
                            <FavoriteBorderIcon/>
                        </IconButton>
                        <Typography paddingLeft={'0.5vw'}> {props.content?.likes} likes</Typography>
                    </Box>
                    <Box sx={{paddingLeft: '5vw', display: 'flex', justifyContent: 'center'}}>
                        <IconButton sx={{maxHeight: '3vh'}} size='small' onClick={handleLike}>
                            <AddCommentIcon/>
                        </IconButton>
                        <Typography paddingLeft={'0.5vw'}> 5 comments</Typography>
                    </Box>
                </Box>
                <Typography mt={'2vh'} textAlign={'center'}>
                    {props.content?.caption}
                </Typography>
            </Box>
        </Modal>
)}

export default MediaPostBox