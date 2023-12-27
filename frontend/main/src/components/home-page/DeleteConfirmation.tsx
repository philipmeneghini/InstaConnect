import { Box, Button, Typography } from '@mui/material'
import React from 'react'

interface DeleteConfirmationProps {
    handleCancel: () => void
    handleDelete: () => void
}

const DeleteConfirmation = (props: DeleteConfirmationProps) => {
    return (
        <Box>
            <Typography sx={{marginBottom: '2vh'}}>Are you sure you want to delete this post? </Typography>
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button onClick={props.handleDelete} variant='contained'>Confirm Deletion</Button>
                <Button sx={{marginLeft: '2vw'}} onClick={props.handleCancel} variant='contained'>Cancel</Button>
            </Box>
        </Box>)
}

export default DeleteConfirmation