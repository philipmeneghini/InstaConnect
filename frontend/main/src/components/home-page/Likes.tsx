import React, { useContext, useEffect, useState } from 'react'
import { ToastContext } from '../context-provider/ToastProvider'
import { useInView } from 'react-intersection-observer'
import { _apiClient } from '../../App'
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import { UserModel } from '../../api/Client'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(
    () => ({
        likesBox: {
            overflowY: 'auto', 
            maxHeight: '30vh'
        },
        listItem: {
            pl: 4 
        }
}))

interface LikesProps {
    likes: string[],
    navigateToProfile: (email: string | undefined) => void
}

const Likes = (props: LikesProps) => {
    const [ likes, setLikes ] = useState<Set<UserModel>>(new Set<UserModel>())
    const [ hasMore, setHasMore ] = useState<boolean>(true)
    const { openToast } = useContext(ToastContext)

    const {ref, inView } = useInView()

    const { likesBox,
            listItem } = useStyles().classes

    useEffect(() => {
        const getUsers = async () => {
            try {
                if (hasMore && (inView || likes.size === 0)) {
                    let index: number = likes.size + 5 > props.likes.length ? props.likes.length : likes.size + 5
                    let users = await _apiClient.usersGET(props.likes.slice(likes.size, index))
                    let newUsers: Set<UserModel> = new Set<UserModel> ([...likes])
                    users.forEach(u => newUsers.add(u))
                    setLikes(newUsers)

                    if (index >= props.likes.length) {
                        setHasMore(false)
                    }
                }
            }
            catch (err: any) {
                if (err.status !== 404) {
                    openToast(false, 'failed to load likes')
                }
                setHasMore(false)
            }
        }
        
        getUsers()
    }, [props, hasMore, inView, openToast])
    
    return (
    <>
        <List className={likesBox} component='div' disablePadding>
            {[...likes].map( (like, index) => (
                (index === (likes.size-1))
                ?
                <ListItemButton ref={ref} key={like?.email} className={listItem} onClick={() => props.navigateToProfile(like?.email)}>
                    <ListItemAvatar>
                        <Avatar src={like?.profilePictureUrl}/>
                    </ListItemAvatar>
                    <ListItemText  primary={like?.email} />
                </ListItemButton>
                :
                <ListItemButton key={like?.email} className={listItem} onClick={() => props.navigateToProfile(like?.email)}>
                    <ListItemAvatar>
                        <Avatar src={like?.profilePictureUrl}/>
                    </ListItemAvatar>
                    <ListItemText primary={like?.email} />
                </ListItemButton>
            ))}
        </List>
    </>)
}

export default Likes