import { useEffect, useState } from 'react'
import { FollowContents } from '../components/home-page/Header'
import { _apiClient } from '../App'
import { UserModel } from '../api/Client'
import axios from 'axios'


const useFollowers = (followerNames: string[] | undefined, followersOpen: boolean): [ FollowContents[] ] => {
    
    const [ followers, setFollowers ] = useState<FollowContents[]>([])

    useEffect(() => {
        const getFollowers = async(users : string[] | undefined) => {
            try {
                const response = await _apiClient.usersGET(users)
                let result : FollowContents[] = new Array<FollowContents>()
                for(let i = 0; i < response.length; i++) {
                    const user : UserModel = response[i]
                    const followContent : FollowContents = { email : user.email , profilePicture : user.profilePictureUrl}
                    try {
                        await axios.get(followContent.profilePicture as string) 
                    }
                    catch {
                        followContent.profilePicture = ''
                    }
                    result.push(followContent)
                }
                setFollowers(result)
            }
            catch {
                setFollowers([])
            }
        }
        getFollowers(followerNames)
    }, [followerNames, followersOpen])

    return [ followers]
}

export default useFollowers