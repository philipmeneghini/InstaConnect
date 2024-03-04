import axios from 'axios'
import { useEffect, useState } from 'react'

const useProfilePicture = (url : string | undefined): [ string ] => {
    
    const [ profilePicture, setProfilePicture ] = useState<string>()

    useEffect(() => {
        const validateUrl = async(url: string) => { 
            try {
                await axios.get(url)
                setProfilePicture(url)
            } 
            catch {
                setProfilePicture('')
            }
        }
        validateUrl(url as string)
    }, [url])

    return [ profilePicture as string ]
}

export default useProfilePicture