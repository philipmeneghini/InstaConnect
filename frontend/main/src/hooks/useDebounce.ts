import {useEffect, useState} from 'react' 

const useDebouce = <T>(value: T, delay?: number) => {
    const [ debouncedValue, setDebouncedValue ] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay ?? 1000)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return [ debouncedValue ]
}
export default useDebouce