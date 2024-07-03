import { useContext, useEffect, useState } from 'react'
import { ContentModel, UserModel } from '../api/Client'
import { useInView } from 'react-intersection-observer'
import { ToastContext } from '../components/context-provider/ToastProvider'
import { _apiClient } from '../App'

const useLazyProfiles = (failureMessage: string, lazyLoad: number, emails: string[])
                        : [ ref: (node?: Element | null | undefined) => void, posts: ContentModel[]] => {

    const [ posts, setPosts ] = useState<ContentModel[]>([])
    const [ hasMore, setHasMore ] = useState<boolean>(true)
    const [ lastDate, setLastDate ] = useState<Date>()
    const { openToast } = useContext(ToastContext)

    const {ref, inView } = useInView()

    
    useEffect(() => {
        if (hasMore && inView){
            setLastDate(posts[posts.length -1].dateCreated)
        }
    }, [hasMore, inView])

    useEffect(() => {
        const getContents = async () => {
            try {
                if (hasMore && (inView || posts.length === 0)) {
                    if (emails.length === 0) {
                        setHasMore(false)
                        return
                    }
                    let contents = await _apiClient.contentsGET(undefined, emails, lastDate, lazyLoad)
                    let newContents = [...posts]
                    newContents.push(...contents)
                    setPosts(newContents)
                }
            }
            catch (err: any) {
                if (err.status !== 404) {
                    openToast(false, failureMessage)
                }
                setHasMore(false)
            }
        }
        
        getContents()
    }, [posts, hasMore, inView, openToast])

    return [ ref, posts ]
}

export default useLazyProfiles