import React, { useState, useEffect } from 'react'
import { CommentModel } from '../../api/Client'
import { Box, Checkbox, Popper, Typography } from '@mui/material'
import {
    usePopupState,
    bindHover,
    bindPopover,
  } from 'material-ui-popup-state/hooks'
import useUser from '../../hooks/useUser'
import { Favorite, FavoriteBorder } from '@mui/icons-material'


interface CommentProps {
    key: string | undefined
    comment: CommentModel
}

const Comment = (props: CommentProps) => {
    
    const [ like, setLike ] = useState<boolean>()
    const [ user ] = useUser()
    const popupState = usePopupState({
        variant: 'popover',
        popupId: 'comment',
      })

    useEffect(() => {
        if (props?.comment?.likes && props?.comment?.likes.indexOf(user?.email as string) >= 0) {
            setLike(true)
        }
        else {
            setLike(false)
        }
    }, [ user, props ] )

    const handleLike = () => {
        like ? setLike(false) : setLike(true)    
    }

    return (
            <>
                <Box sx={{padding: '0.5vh', '&:hover': { backgroundColor: '#F1EDF2'}}} {...bindHover(popupState)}>
                    <Typography sx={{display: 'flex', justifyContent: 'left', marginLeft: '1vw'}}>
                        <strong>{props?.comment?.email}: </strong> {props?.comment?.body}
                    </Typography>
                </Box>
                <Popper
                    {...bindPopover(popupState)}
                    sx={{marginBottom: '-3vh'}}
                    placement='top-end'
                >
                    <Checkbox onClick={handleLike} checked={like} sx={{paddingTop: '0',display: 'inline'}} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                </Popper>
            </>
    )
}

export default Comment