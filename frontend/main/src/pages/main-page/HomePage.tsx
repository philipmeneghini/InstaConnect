import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { ContentModel, UserModel } from '../../api/Client'
import Header from '../../components/home-page/Header'
import React from 'react'
import { Box, CircularProgress, Fab, Modal, Paper, Tooltip } from '@mui/material'
import PostContentBox from '../../components/home-page/PostContentBox'
import AddIcon from '@mui/icons-material/Add'
import CreatePostBox from '../../components/home-page/CreatePostBox'
import useUser from '../../hooks/useUser'

const fabStyling = {
    position: 'fixed',
    bottom: 10,
    right: 8,
}

const postBoxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    maxHeight: '90vh',
    bgcolor: 'whitesmoke',
    border: '1px solid #000',
    p: '2vh',
    overflowY: 'auto',
}

const dateUpdatedDescending = (a: UserContents, b: UserContents): number => {
    if (a.content.dateUpdated && b.content.dateUpdated)
        return 0
    else if (a.content.dateUpdated)
        return 1
    else if (b.content.dateUpdated)
        return -1
    
    return (a.content.dateUpdated ?? new Date()) > (b.content.dateUpdated ?? new Date()) ? 1 : (a.content.dateUpdated === b.content.dateUpdated ? 0 : -1)
}

export interface UserContents {
    user: UserModel
    content: ContentModel
}

export const HomePage = () => {
    const [ user ] = useUser()
    const [ contents, setContents ] = useState<UserContents[]> ([])
    const [ contentLoadMessage, setContentLoadMessage ] = useState<string | null>(null)
    const [ createPostOpen, setCreatePostOpen ] = useState<boolean>(false)

    useEffect(() => {
        const getUsersFollowing = async(user: UserModel | undefined) => {
            if (user?.following) {
                    let currentUserContents: UserContents[] = []
                    for (let userFollowing of (user.following)) {
                        try {
                            let contentUser: UserContents
                            let userResponse = await _apiClient.userGET(userFollowing)
                            let contentResponse = await _apiClient.contentsGET(userFollowing)
                            for(let i = 0; i < contentResponse.length; i++) {
                                contentUser = {
                                    user: userResponse,
                                    content: contentResponse[i],
                                }
                                currentUserContents.push(contentUser)
                            }
                        }
                        catch {
                            continue
                        }
                        currentUserContents.sort(dateUpdatedDescending)
                    }
                    currentUserContents.sort(dateUpdatedDescending)
                    setContents(currentUserContents)
                    if (currentUserContents.length > 0)
                        setContentLoadMessage(null)
                    else
                        setContentLoadMessage('No content from users following to show')
            }
            else {
                setContentLoadMessage('You are not currently following anyone')
            }
        }
        getUsersFollowing(user)
    }, [user])

    const handleCreatePost = () => { setCreatePostOpen(true) }
    const handleCreatePostClose = () => { setCreatePostOpen(false) }

    return (
        user ? 
        <div>
            <Header user={user}/>
            {contents.length !== 0 && contentLoadMessage === null ? 
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10vh'}}>
                {contents.map( (userContent) => (
                    <Paper key={userContent?.content?.id} elevation={24} sx={{margin: '2vh 0', width: '40vw', padding: '2% 0 1%'}}>
                        <PostContentBox key={userContent?.content?.id} userContent={userContent} user={user}/>
                    </Paper>
                ))}
            </Box> :
            <CircularProgress sx={{marginTop: '20vh'}}/>}
            <Tooltip title='Add Post'>
                <Fab onClick={handleCreatePost} sx={fabStyling} color='primary' aria-label='add'>
                    <AddIcon />
                </Fab>
            </Tooltip>
            <Modal
            open={createPostOpen}
            onClose={handleCreatePostClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            >
                <Box sx={postBoxStyle}>
                    <CreatePostBox handleClose={handleCreatePostClose}/>
                </Box>
            </Modal>
        </div> :
        <></>
)}

export default HomePage