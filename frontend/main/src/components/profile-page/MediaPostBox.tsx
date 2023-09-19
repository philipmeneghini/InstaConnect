import { _apiClient } from '../../App'
import { ContentModel, UserModel } from '../../api/Client'
import React from 'react'
import {  Avatar, Box, Button, Modal, Typography } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AddCommentIcon from '@mui/icons-material/AddComment'

const postModalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 12,
    p: 7,
  }

const postBoxStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 12,
    p: 7,
    overflow: 'scroll',
}

const interactionToolbarStyle = {
    marginTop: '3vh',
    display: 'flex',
    margin: 'auto',
}

interface MediaPostBoxProps {
    user: UserModel
    content: ContentModel | null
    setContent:  React.Dispatch<React.SetStateAction<ContentModel | null>>
    profilePicture: string | undefined
}

export const MediaPostBox = (props: MediaPostBoxProps) => {

    const handleClose = () => { props.setContent(null) }

    return (
        <Modal
            open={props.content ? true : false}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            sx={postModalStyle}
        >
            <Box sx={postBoxStyle}>
                <Box sx={{display:'flex', justifyContent: 'space-between', marginBottom: '20px', paddingTop: '2px'}}>
                    <Avatar src={props.profilePicture} sx={{ width: '100', height: '100'}}/>
                    <Typography> {props.user.firstName} {props.user.lastName} </Typography>
                    <Button variant='contained' onClick={handleClose}> Close </Button>
                </Box>
                <img
                    src={props.content?.mediaUrl}
                    srcSet={props.content?.mediaUrl}
                    alt={props.content?.caption}
                    loading='lazy'
                    style={{display: 'flex', margin: 'auto', border: '5px'}}
                />
                <Box sx={interactionToolbarStyle}>
                    <FavoriteBorderIcon sx={interactionToolbarStyle}/>
                    <AddCommentIcon sx={interactionToolbarStyle}/>
                </Box>
                <Typography mt={2} textAlign='center'>
                    {props.content?.caption}
                </Typography>
            </Box>
        </Modal>
)}

export default MediaPostBox