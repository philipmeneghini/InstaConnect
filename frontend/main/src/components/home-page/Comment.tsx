import React, { useState } from 'react'
import { CommentModel } from '../../api/Client'
import { Box, IconButton, Popper, Typography } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'


interface CommentProps {
    key: string | undefined
    comment: CommentModel
}

const Comment = (props: CommentProps) => {
    
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    const handleOpenPopup = (event: React.MouseEvent<HTMLElement>) => {
        if (!anchorEl) {
            setAnchorEl(event.currentTarget)
        }
    }

    const handleClosePopup = () => {
        if (anchorEl) {
            setAnchorEl(null)
        }
    }

    return (
            <Box sx={{padding: '0.5vh', '&:hover': { backgroundColor: '#F1EDF2'}}}
            onMouseEnter={handleOpenPopup}
            onMouseLeave={handleClosePopup}
            >
                <Typography sx={{display: 'flex', justifyContent: 'left', marginLeft: '1vw'}}>
                    <strong>{props?.comment?.email}: </strong> {props?.comment?.body}
                </Typography>
                <Popper
                    id='mouse-over-popover'
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    placement='top-end'
                    onMouseEnter={handleOpenPopup}
                    onMouseLeave={handleClosePopup}
                >
                    <Box sx={{marginBottom: '-2vh'}}>
                        <IconButton>
                            <FavoriteBorderIcon/>
                        </IconButton>
                    </Box>
                </Popper>
            </Box>
    )
}

export default Comment