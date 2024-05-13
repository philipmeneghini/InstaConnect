import { useContext, useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { ContentModel, UserModel } from '../../api/Client'
import Header from '../../components/home-page/Header'
import React from 'react'
import { Box, CircularProgress, Fab, Modal, Paper, Tooltip } from '@mui/material'
import PostContentBox from '../../components/home-page/PostContentBox'
import AddIcon from '@mui/icons-material/Add'
import CreatePostBox from '../../components/home-page/CreatePostBox'
import { UserContext } from '../../components/context-provider/UserProvider'
import { useInView } from 'react-intersection-observer'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(
    () => ({
        fabStyling: {
            position: 'fixed',
            bottom: 10,
            right: 8,
        },
        modalBox: { 
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
        },
        contentsBox: {
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            marginTop: '10vh'
        },
        contentsPaper: {
            margin: '2vh 0', 
            width: '40vw', 
            padding: '2% 0 1%'
        },
        progressBar: {
            marginTop: '20vh'
        }

  }))

export interface UserContents {
    user: UserModel
    content: ContentModel
}

export const HomePage = () => {
    const [ keyedUsers, setKeyedUsers ] = useState<Map<string, UserModel>>(new Map<string, UserModel>())
    const [ contents, setContents ] = useState<UserContents[]> ([])
    const [ contentLoadMessage, setContentLoadMessage ] = useState<string | null>(null)
    const [ createPostOpen, setCreatePostOpen ] = useState<boolean>(false)
    const [ lastDate, setLastDate ] = useState<Date>()
    const [ hasMore, setHasMore ] = useState<boolean>(true)

    const { user } = useContext(UserContext)

    const {ref, inView } = useInView()

    useEffect(() => {
        if (hasMore && inView){
            setLastDate(contents[contents.length -1].content.dateCreated)
        }
    }, [hasMore, inView])

    useEffect(() => {
        const getUsersFollowing = async() => {
            if (keyedUsers) {
                let currentUserContents: UserContents[] = [...contents]
                try {
                    let newContents = await _apiClient.contentsGET(undefined, [...keyedUsers.keys()], lastDate, 4)
                    for (let content of newContents) {
                        let userContent: UserContents = {
                            user: keyedUsers.get(content.email) as UserModel,
                            content: content
                        }
                        currentUserContents.push(userContent)
                    }
                    setContents(currentUserContents)
                    if (currentUserContents.length > 0)
                        setContentLoadMessage(null)
                    else
                        setContentLoadMessage('No posts to show from followers!')
                }
                catch(err: any) {
                    if (err.status === 404) {
                        setHasMore(false)
                    }
                    else {
                        setContentLoadMessage('Error loading content from followers!')
                    }
                }
            }
        }

        getUsersFollowing()
    }, [keyedUsers, lastDate])

    useEffect(() => {
        const getFollowing = async() => {
            if (user && user.following) {
                let users = await _apiClient.usersGET(user.following)
                let keyedUsers: Map<string, UserModel> = new Map<string, UserModel>()
                    users.forEach(user => {
                        if (!keyedUsers.get(user.email)) {
                            keyedUsers.set(user.email, user)
                        }
                })
                setKeyedUsers(keyedUsers)
            }
            setContents([])
            setHasMore(true)
        }
        getFollowing()
    }, [user])

    const {
        fabStyling,
        modalBox,
        contentsBox,
        contentsPaper,
        progressBar
    } = useStyles().classes

    const handleCreatePost = () => { setCreatePostOpen(true) }
    const handleCreatePostClose = () => { setCreatePostOpen(false) }

    return (
        user ? 
        <div>
            <Header user={user}/>
            {contents.length !== 0 && contentLoadMessage === null ? 
            <Box className={contentsBox}>
                {contents.map( (userContent, index) => (
                    (index === contents.length -1) ?
                        <Paper ref={ref} key={userContent?.content?.id} className={contentsPaper} elevation={24}>
                            <PostContentBox key={userContent?.content?.id} userContent={userContent}/>
                        </Paper>
                    :
                    <Paper key={userContent?.content?.id} className={contentsPaper} elevation={24}>
                        <PostContentBox key={userContent?.content?.id} userContent={userContent}/>
                    </Paper>
                ))}
            </Box> :
            <CircularProgress className={progressBar}/>}
            <Tooltip title='Add Post'>
                <Fab onClick={handleCreatePost} className={fabStyling} color='primary' aria-label='add'>
                    <AddIcon />
                </Fab>
            </Tooltip>
            <Modal
            open={createPostOpen}
            onClose={handleCreatePostClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            >
                <Box className={modalBox}>
                    <CreatePostBox handleClose={handleCreatePostClose}/>
                </Box>
            </Modal>
        </div> :
        <></>
)}

export default HomePage