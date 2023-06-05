import axios, { AxiosError } from 'axios'
import { GenericResponse, IBaseApiClient } from './IBaseApiClient'

export class BaseApiClient implements IBaseApiClient {
    
    private url: string

    constructor(url: string) {
        this.url = url
    }

    postApi = async<T1, T2>(endpoint: string, requestBody: T1): Promise<GenericResponse<T2>> => {
        try {
            const response = await axios.post(this.url + endpoint, requestBody)
            return { 
                data: response?.data, 
                statusCode: response?.status
            }
        }
        catch(error: any) {
            const err = error as AxiosError
            return {
                message: err?.message,
                statusCode: err?.response?.status
            }
        }
    }
}