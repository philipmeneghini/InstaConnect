import { useContext, useEffect, useState } from "react"
import { ToastContext } from "../context-provider/ToastProvider"
import { useInView } from "react-intersection-observer"
import { _apiClient } from "../../App"
import React from "react"
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import { UserModel } from "../../api/Client"

interface LikesProps {
    likes: string[],
    navigateToProfile: (email: string | undefined) => void
}

const Likes = (props: LikesProps) => {
    const [ index, setIndex ] = useState<number>(0)
    const [ likes, setLikes ] = useState<Set<UserModel>>(new Set<UserModel>())
    const [ hasMore, setHasMore ] = useState<boolean>(true)
    const { openToast } = useContext(ToastContext)

    const {ref, inView } = useInView()

    useEffect(() => {
        if (inView && hasMore) {
            setIndex(prev => prev + 10 >  props.likes.length-1 
                    ? props.likes.length - 1
                    : prev + 10)
        }
    }, [hasMore, inView])

    useEffect(() => {
        const getUsers = async () => {
            try {
                if (hasMore) {
                    let users = await _apiClient.usersGET(props.likes.slice(index, (index + 10) > props.likes.length ? props.likes.length : index + 10))
                    let newUsers: Set<UserModel> = likes
                    users.forEach(u => newUsers.add(u))
                    setLikes(newUsers)
                }

                if (index === props.likes.length - 1) {
                    setHasMore(false)
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
    }, [index, props, hasMore, openToast])
    
    return (
    <>
        <List sx={{overflowY: 'auto', maxHeight: '65vh'}} component="div" disablePadding>
            {[...likes].map( (like, index) => (
                (index === likes.size - 1)
                ? <ListItemButton ref={ref} key={like?.email} onClick={() => props.navigateToProfile(like?.email)} sx={{ pl: 4 }}>
                    <ListItemAvatar>
                        <Avatar src={like?.profilePictureUrl}/>
                    </ListItemAvatar>
                    <ListItemText primary={like?.email} />
                </ListItemButton>
                : <ListItemButton key={like?.email} onClick={() => props.navigateToProfile(like?.email)} sx={{ pl: 4 }}>
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