import { useContext, useEffect, useState } from 'react'
import { UserModel } from '../api/Client'
import { useInView } from 'react-intersection-observer'
import { ToastContext } from '../components/context-provider/ToastProvider'
import { _apiClient } from '../App'

const useLazyProfiles = (failureMessage: string, lazyLoad: number, profiles: string[])
                        : [ ref: (node?: Element | null | undefined) => void, profileContents: UserModel[]] => {

    const [ profileContents, setProfileContents ] = useState<UserModel[]>([])
    const [ hasMore, setHasMore ] = useState<boolean>(true)
    const { openToast } = useContext(ToastContext)

    const {ref, inView } = useInView()

    useEffect(() => {
        const getUsers = async () => {
            try {
                if (hasMore && (inView || profileContents.length === 0)) {
                    let index: number = (profileContents.length + lazyLoad) > profiles.length 
                                        ? profiles.length 
                                        : profileContents.length + lazyLoad
                    if (profiles.length === 0) {
                        setHasMore(false)
                        return
                    }
                    let users = await _apiClient.usersGET(profiles.slice(profileContents.length, index))
                    let newUsers = [...profileContents]
                    newUsers.push(...users)
                    setProfileContents(newUsers)

                    if (index >= profiles.length) {
                        setHasMore(false)
                    }
                }
            }
            catch (err: any) {
                if (err.status !== 404) {
                    openToast(false, failureMessage)
                }
                setHasMore(false)
            }
        }
        
        getUsers()
    }, [profiles, hasMore, inView, openToast])

    return [ ref, profileContents ]
}

export default useLazyProfiles