import { useContext, useEffect, useState } from "react"
import { CommentModel } from "../../api/Client"
import { useInView } from "react-intersection-observer"
import { _apiClient } from "../../App"
import React from "react"
import { Avatar, Box, IconButton, InputAdornment, TextField } from "@mui/material"
import Comment from './Comment'
import { UserContext } from "../context-provider/UserProvider"
import { ToastContext } from "../context-provider/ToastProvider"
import SendIcon from '@mui/icons-material/Send'

interface CommentsProps {
    contentId : string | undefined
    comments: CommentModel[],
    addComments: (comments: CommentModel[]) => void,
    addUserComment: (comment: CommentModel) => void
}

const Comments = (props: CommentsProps) => {
    const [ newComment, setNewComment ] = useState<string>('')
    const [ hasMore, setHasMore ] = useState<boolean>(true)

    const { user } = useContext(UserContext) 
    const { openToast } = useContext(ToastContext)

    const {ref, inView } = useInView()

    useEffect(() => {
        const getComments = async (contentId: string) => {
            try {
                if (hasMore && inView) {
                    const response = await _apiClient.commentsGET(undefined, [ contentId ], props.comments.length === 0 ? undefined : props.comments[props.comments.length - 1].dateCreated, 10)
                    if (response.length === 0) {
                        setHasMore(false)
                    }
                    else {
                        props.addComments(response)
                    }
                }
            }
            catch(err: any) {
                if (err.status === 404) {
                    setHasMore(false)
                }
                else {
                    openToast(false, 'Failed to load more comments')
                    setHasMore(false)
                }
            }
        }     

        getComments(props.contentId as string)

    }, [props.contentId, hasMore, inView, openToast])

    const sendComment = async () => { 
        try {
            let newCommentModel: CommentModel
            newCommentModel = { contentId: props.contentId, likes: [], body: newComment, email: user?.email as string } as CommentModel
            await _apiClient.commentPOST(newCommentModel)
            setNewComment('')
            props.addUserComment(newCommentModel)
        }
        catch(err: any) {
            openToast(false, err.message)
        }
    }

    return (
        <>
            <Box sx={{overflow: 'auto', maxHeight: '30vh', p: '1px'}}>
                {props.comments.map( (comment, index) => (
                    <Comment key={comment?.id} comment={comment}/>
                ))}
                <div ref={ref}></div>
            </Box>
            <TextField
            sx={{display: 'flex', justifyContent: 'left', marginLeft: '0.8vw', marginTop: '3vh'}}
            label={user?.email}
            value={newComment}
            InputProps={{
                startAdornment: (
                    <InputAdornment position='start'>
                        <Avatar src={user?.profilePictureUrl} sx={{ width: '4vh', height: '4vh'}}/>
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
        </>
    )
}

export default Comments