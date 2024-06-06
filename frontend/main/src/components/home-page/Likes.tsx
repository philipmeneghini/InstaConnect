import React from 'react'
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import useLazyProfiles from '../../hooks/useLazyProfiles'

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
    
    const [ ref, likes ] = useLazyProfiles('Failed to load likes!', 5, props.likes ?? [])

    const { likesBox,
            listItem } = useStyles().classes
    
    return (
    <>
        <List className={likesBox} component='div' disablePadding>
            {likes.map( (like, index) => (
                (index === (likes.length -1))
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