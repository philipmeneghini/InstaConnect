import React, { useState, useEffect, useContext } from 'react'
import { CommentModel } from '../../api/Client'
import { Box, Checkbox, IconButton, Tooltip, Typography, TextField, Button } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit'
import EditOffIcon from '@mui/icons-material/EditOff'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { _apiClient } from '../../App'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../utils/Constants'
import { ToastContext } from '../context-provider/ToastProvider'
import { UserContext } from '../context-provider/UserProvider'

const useStyles = makeStyles<{ hover: boolean }>()(
    (theme, { hover }) => ({
        trashIcon: {
            color: 'red'
        },
        comment: {
            backgroundColor: hover ? '#F4F5F4' : 'white'
        },
        commentBox: {
            p: hover ? '0.5vh 0 0 0' :'0.5vh'
        },
        commentText: {
            textAlign: 'left', 
            paddingLeft: '1vw'
        },
        commentTextHeader: {
            display: 'inline', 
            font: hover ? '1.1rem' : '1rem',
            '&:hover': { cursor: 'pointer' }
        },
        commentTextBody: {
            display: 'inline',
            font: hover ? '1.1rem' : '1rem'
        },
        commentToolbar: {
            display: hover ? 'flex' : 'none', 
            justifyContent: 'left', 
            marginLeft: '1vw'
        },
        commentLikes: {
            margin: 'auto 0'
        },
        commentEdit: {
            margin: '0 1vw'
        },
        commentButtonEdit: {
            display: hover ? 'flex' : 'none',
            marginLeft: 'auto'
        },
        commentButtonDelete: {
            display: hover ? 'flex' : 'none',
            marginLeft: 'auto',
            color: 'red'
        }
}))

interface CommentProps {
    key: string | undefined
    comment: CommentModel
}

const Comment = (props: CommentProps) => {
    const [ liked, setLiked ] = useState<boolean>(true)
    const [ likes, setLikes ] = useState<string[]>(props?.comment?.likes ?? [])
    const [ commentBody, setCommentBody ] = useState<string>(props?.comment?.body ?? '')
    const [ editMode, setEditMode ] = useState<boolean>(false)
    const [ deleteMode, setDeleteMode ] = useState<boolean>(false)
    const [ hoverDisplay, setHoverDisplay ] = useState<boolean>(false)
    const [ deleted, setDeleted ] = useState<boolean>(false)
    
    const { user } = useContext(UserContext)
    const toastContext = useContext(ToastContext)

    useEffect(() => {
        if(!user?.email) {
            setLiked(false)
        }
        else if (likes.indexOf(user.email) >= 0) {
            setLiked(true)
        }
        else {
            setLiked(false)
        }
    }, [likes, user?.email])

    const navigate = useNavigate()

    const { classes } = useStyles({ hover: hoverDisplay })

    const {
        trashIcon,
        comment,
        commentBox,
        commentText,
        commentTextHeader,
        commentTextBody,
        commentToolbar,
        commentLikes,
        commentEdit,
        commentButtonEdit,
        commentButtonDelete
    } = classes

    const handleLike = async () => {
        try {
            let newComment: CommentModel = props?.comment
            let newLikes: string[] = likes
            newComment.dateCreated = undefined
            newComment.dateUpdated = undefined
            if (liked) {
                newLikes.splice(likes?.indexOf(user?.email as string), 1)
                newComment.likes = newLikes
                await _apiClient.commentPUT( newComment)
                setLikes(newLikes)
                setLiked(false)
            }
            else {
                newLikes.push(user?.email as string)
                newComment.likes = newLikes
                await _apiClient.commentPUT( newComment )
                setLikes(newLikes)
                setLiked(true)
            }
        }
        catch (err: any) {
            toastContext.openToast(false, 'Error changing like status : ' + err.message)
        }
    }

    const handleEnterComment = () => {
        setHoverDisplay(true)
    }

    const handleLeaveComment = () => {
        if(!editMode && !deleteMode) {
            setHoverDisplay(false)
            setCommentBody(props?.comment?.body ??'')
        }
    }

    const handleEdit = () => {
        if (editMode) {
            setCommentBody(props?.comment?.body ?? '')
        }
        setEditMode(prevState => !prevState)
        setDeleteMode(false)
    }

    const setDeleting = () => {
        setDeleteMode(prevState => !prevState)
        setEditMode(false)
        setCommentBody(props?.comment?.body ?? '')
    }

    const handleDelete = async () => {
        try {
            await _apiClient.commentDELETE(props?.comment?.id)
            toastContext.openToast(true, 'Successfully Deleted Comment!')
            setDeleted(true)
        }
        catch (err: any){
            toastContext.openToast(false, 'Error Deleting Comment : ' + err.message)
            setDeleted(false)
        }
    }

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentBody(e.target.value)
    }

    const handleSave = async () => {
        try {
            let newComment: CommentModel = props?.comment
            newComment.dateCreated = undefined
            newComment.dateUpdated = undefined
            newComment.body = commentBody
            await _apiClient.commentPUT(newComment)
            toastContext.openToast(true, 'Successfully Changed Comment!')
            setEditMode(false)
        }
        catch (err: any) {
            toastContext.openToast(false, 'Error Editing Comment : ' + err.message)
            setCommentBody(props?.comment?.body ?? '')
        }
    }

    const navigateToProfile = (email : string | undefined) => {
        if (props?.comment?.email) {
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

    return (
        <>
        { !deleted ?
        <>
            <Box className={comment}
                onMouseEnter={handleEnterComment}
                onMouseLeave={handleLeaveComment}
            >
                <Box className={commentBox} >
                    {!editMode ?
                    <Box className={commentText}>
                        <Typography className={commentTextHeader} onClick={() => navigateToProfile(props?.comment?.email)}>
                            <strong>{props?.comment?.email}: </strong>
                        </Typography>
                        <Typography className={commentTextBody}>
                            {commentBody}
                        </Typography>
                    </Box>
                    : <TextField
                        multiline
                        fullWidth
                        value={commentBody}
                        onChange={handleCommentChange}
                        variant='standard'/>}
                </Box>
                <Box className={commentToolbar}>
                    <Tooltip title={liked ? 'Unlike Comment' : 'Like Comment'}>
                        <Checkbox size='small' onClick={handleLike} checked={liked} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                    </Tooltip>
                    <Typography className={commentLikes}>{likes?.length ?? 0} Likes </Typography>
                    {user?.email === props?.comment?.email &&
                    <>
                        <IconButton className={commentEdit} size='small' onClick={handleEdit}>
                            <Tooltip title={editMode ? 'Stop Editing Comment' : 'Edit Comment'}>
                                {editMode ? <EditOffIcon/> : <EditIcon/> }
                            </Tooltip>
                        </IconButton>
                        <IconButton  size='small' onClick={setDeleting}>
                            <Tooltip title={deleteMode ? 'Cancel Deleting Comment' :'Delete Comment' }>
                                {deleteMode ? <RestoreFromTrashIcon className={trashIcon}/>:<DeleteForeverIcon className={trashIcon}/> }
                            </Tooltip>
                        </IconButton>
                        { deleteMode && <Button className={commentButtonDelete} size='small' onClick={handleDelete}>
                            Confirm Deletion
                        </Button>}
                        { editMode && <Button className={commentButtonEdit} size='small' onClick={handleSave}>
                            Save Changes
                        </Button>}
                    </>}
                </Box>
            </Box>
        </>
        : <></>}
    </>)
}

export default Comment