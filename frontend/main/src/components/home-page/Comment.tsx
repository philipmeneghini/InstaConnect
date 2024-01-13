import React, { useState, useEffect } from 'react'
import { CommentModel } from '../../api/Client'
import { Box, Checkbox, Typography } from '@mui/material'
import useUser from '../../hooks/useUser'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { _apiClient } from '../../App'

interface CommentProps {
    key: string | undefined
    comment: CommentModel
}

const Comment = (props: CommentProps) => {
    
    const [ like, setLike ] = useState<boolean>()
    const [ likes, setLikes ] = useState<number>(props?.comment?.likes?.length ?? 0)
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

    return (
            <Box sx={{backgroundColor: hoverButton ? '#F1EDF2' : 'white'}}
                onMouseEnter={handleEnterComment}
                onMouseLeave={handleLeaveComment}
            >
                <Box sx={{padding: hoverButton ? '0.5vh 0 0 0' :'0.5vh' }} >
                    <Typography variant='body1' fontSize={hoverButton ? '1.1rem' : '1rem'} sx={{display: 'flex', justifyContent: 'left', marginLeft: '1vw'}}>
                        <strong>{props?.comment?.email}: </strong> {props?.comment?.body}
                    </Typography>
                </Box>
                <Box sx={{ display: hoverButton ? 'flex' : 'none', justifyContent: 'left', marginLeft: '1vw'}}>
                    <Checkbox size='small' onClick={handleLike} checked={like} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                    <Typography sx={{margin: 'auto 0'}}>{likes} Likes </Typography>
                </Box>
            </Box>
    )
}

export default Comment