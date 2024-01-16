import React, { useState, useEffect } from 'react'
import { CommentModel } from '../../api/Client'
import { Box, Checkbox, IconButton, Tooltip, Typography, TextField, Button } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import useUser from '../../hooks/useUser'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit'
import EditOffIcon from '@mui/icons-material/EditOff'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { _apiClient } from '../../App'
import { FormProperties } from '../../utils/FormProperties'
import SubmissionAlert from '../login-pages/SubmissionAlert'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import { useNavigate } from 'react-router-dom'
import { Paths } from '../../utils/Constants'

const useStyles = makeStyles<{ hover: boolean }>()(
    (theme, { hover }) => ({
        comment: {
            backgroundColor: hover ? '#F4F5F4' : 'white'
        },
        commentBox: {
            p: hover ? '0.5vh 0 0 0' :'0.5vh'
        },
        commentTextHeader: {
            display: 'flex', 
            justifyContent: 'left', 
            marginLeft: '1vw',
            font: hover ? '1.1rem' : '1rem'
        },
        commentTextBody: {
            display: 'flex', 
            justifyContent: 'left', 
            margin: 'auto 0 auto 0.2vw',
            font: hover ? '1.1rem' : '1rem'
        },
        commentToolbar: {
            display: hover ? 'flex' : 'none', 
            justifyContent: 'left', 
            marginLeft: '1vw'
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
    
    const [ like, setLike ] = useState<boolean>()
    const [ likes, setLikes ] = useState<number>(props?.comment?.likes?.length ?? 0)
    const [ commentBody, setCommentBody ] = useState<string>(props?.comment?.body ?? '')
    const [ editMode, setEditMode ] = useState<boolean>(false)
    const [ hoverButton, setHoverButton ] = useState<boolean>(false)
    const [ deleted, setDeleted ] = useState<boolean>(false)
    const [ deleteAction, setDeleteAction ] = useState<boolean>(false)
    const [ user ] = useUser()
    const [ alert, setAlert ] = useState<FormProperties>({
        isOpen: false,
        isSuccess: true,
        message: ''
    })

    useEffect(() => {
        if (props?.comment?.likes && props?.comment?.likes.indexOf(user?.email as string) >= 0) {
            setLike(true)
        }
        else {
            setLike(false)
        }
    }, [ user, props ] )

    const navigate = useNavigate()

    const { classes } = useStyles({ hover: hoverButton })

    const {
        comment,
        commentBox,
        commentTextHeader,
        commentTextBody,
        commentToolbar,
        commentButtonEdit,
        commentButtonDelete
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
        catch (err: any) {
            setAlert({
                isOpen: true,
                isSuccess: false,
                message: 'Error changing like status : ' + err.message
            })
        }
    }

    const handleEnterComment = () => {
        setHoverButton(true)
    }

    const handleLeaveComment = () => {
        setHoverButton(false)
        setEditMode(false)
        setDeleteAction(false)
        setCommentBody(props?.comment?.body ?? '')
    }

    const handleEdit = () => {
        if (editMode) {
            setCommentBody(props?.comment?.body ?? '')
        }
        setEditMode(prevState => !prevState)
        setDeleteAction(false)
    }

    const setDeleting = () => {
        setDeleteAction(prevState => !prevState)
        setEditMode(false)
        setCommentBody(props?.comment?.body ?? '')
    }

    const handleDelete = async () => {
        try {
            await _apiClient.commentDELETE(props?.comment?.id)
            setAlert({
                isOpen: true,
                isSuccess: true,
                message: 'Successfully Deleted Comment!'
            })
            setDeleted(true)
        }
        catch (err: any){
            setAlert({
                isOpen: true,
                isSuccess: false,
                message: 'Error Deleting Comment : ' + err.message
            })
            setDeleted(false)
        }
    }

    const handleCommentChange = (e: any) => {
        setCommentBody(e.target.value)
    }

    const handleSave = async () => {
        try {
            let newComment: CommentModel = props?.comment
            newComment.dateCreated = undefined
            newComment.dateUpdated = undefined
            newComment.body = commentBody
            await _apiClient.commentPUT(newComment)
            setAlert({
                isOpen: true,
                isSuccess: true,
                message: 'Successfully Changed Comment!'
            })
            setEditMode(false)
        }
        catch (err: any) {
            setAlert({
                isOpen: true,
                isSuccess: false,
                message: 'Error Editing Comment : ' + err.message
            })
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
                    <Box sx={{display: 'flex', justifyContent: 'left'}}>
                        <IconButton color='inherit' onClick={() => navigateToProfile(props?.comment?.email)}>
                            <Typography className={commentTextHeader} variant='body1' >
                                <strong>{props?.comment?.email}: </strong>
                            </Typography>
                        </IconButton>
                        <Typography className={commentTextBody} variant='body1'>
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
                        <IconButton  size='small' onClick={setDeleting}>
                            <Tooltip title={deleteAction ? 'Cancel Deleting Comment' :'Delete Comment' }>
                                {deleteAction ? <RestoreFromTrashIcon sx={{color: 'red'}}/>:<DeleteForeverIcon sx={{color: 'red'}}/> }
                            </Tooltip>
                        </IconButton>
                        { deleteAction && <Button className={commentButtonDelete} size='small' onClick={handleDelete}>
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
        <SubmissionAlert value={alert} setValue={setAlert}/>
    </>)
}

export default Comment