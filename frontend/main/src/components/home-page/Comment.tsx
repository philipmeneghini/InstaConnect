import React, { useState, useEffect } from 'react'
import { CommentModel } from '../../api/Client'
import { Box, Checkbox, IconButton, Tooltip, Typography } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import useUser from '../../hooks/useUser'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit'
import EditOffIcon from '@mui/icons-material/EditOff'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { _apiClient } from '../../App'

const useStyles = makeStyles<{ hover: boolean }>()(
    (theme, { hover }) => ({
        comment: {
            backgroundColor: hover ? '#F4F5F4' : 'white'
        },
        commentBox: {
            p: hover ? '0.5vh 0 0 0' :'0.5vh'
        },
        commentText: {
            display: 'flex', 
            justifyContent: 'left', 
            marginLeft: '1vw',
            font: hover ? '1.1rem' : '1rem'
        },
        commentToolbar: {
            display: hover ? 'flex' : 'none', 
            justifyContent: 'left', 
            marginLeft: '1vw'
        },
}))

interface CommentProps {
    key: string | undefined
    comment: CommentModel
}

const Comment = (props: CommentProps) => {
    
    const [ like, setLike ] = useState<boolean>()
    const [ likes, setLikes ] = useState<number>(props?.comment?.likes?.length ?? 0)
    const [ editMode, setEditMode ] = useState<boolean>(false)
    const [ hoverButton, setHoverButton ] = useState<boolean>(false)
    const [ user ] = useUser()

    useEffect(() => {
        if (props?.comment?.likes && props?.comment?.likes.indexOf(user?.email as string) >= 0) {
            setLike(true)
        }
        else {
            setLike(false)
        }
    }, [ user, props ] )

    const { classes } = useStyles({ hover: hoverButton })

    const {
        comment,
        commentBox,
        commentText,
        commentToolbar
    } = classes

    const handleLike = async () => {
        try {
            let newComment: CommentModel = props?.comment
            newComment.dateCreated = undefined
            newComment.dateUpdated = undefined
            if (like && newComment?.likes && newComment?.likes.indexOf(user?.email as string) > -1) {
                newComment.likes?.splice(newComment?.likes?.indexOf(user?.email as string), 1)
                await _apiClient.commentPUT( newComment)
                setLike(false)
                setLikes(prevState => prevState - 1)
            }
            else {
                newComment?.likes ? newComment?.likes.push(user?.email as string) : newComment.likes = [ user?.email as string ]
                await _apiClient.commentPUT( newComment )
                setLike(true)  
                setLikes(prevState => prevState + 1)
            }
        }
        catch {
            console.log('Failed to update like')
        }
    }

    const handleEnterComment = () => {
        setHoverButton(true)
    }

    const handleLeaveComment = () => {
        setHoverButton(false)
    }

    const handleEdit = () => {
        setEditMode(prevState => !prevState)
    }

    const handleDelete = () => {
    }

    return (
            <Box className={comment}
                onMouseEnter={handleEnterComment}
                onMouseLeave={handleLeaveComment}
            >
                <Box className={commentBox} >
                    <Typography className={commentText} variant='body1' >
                        <strong>{props?.comment?.email}: </strong> {props?.comment?.body}
                    </Typography>
                </Box>
                <Box className={commentToolbar}>
                    <Tooltip title={like ? 'Unlike Comment' : 'Like Comment'}>
                        <Checkbox size='small' onClick={handleLike} checked={like} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                    </Tooltip>
                    <Typography sx={{margin: 'auto 0'}}>{likes} Likes </Typography>
                    {user?.email === props?.comment?.email &&
                    <>
                        <IconButton sx={{margin: '0 1vw'}} size='small' onClick={handleEdit}>
                            <Tooltip title={editMode ? 'Stop Editing Comment' : 'Edit Comment'}>
                                {editMode ? <EditOffIcon/> : <EditIcon/> }
                            </Tooltip>
                        </IconButton>
                        <IconButton  size='small' onClick={handleDelete}>
                            <Tooltip title='Delete Comment'>
                                <DeleteForeverIcon sx={{color: 'red'}}/> 
                            </Tooltip>
                        </IconButton>
                    </>}
                </Box>
            </Box>
    )
}

export default Comment