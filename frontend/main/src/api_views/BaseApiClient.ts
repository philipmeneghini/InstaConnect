import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { GenericResponse, IBaseApiClient } from './IBaseApiClient'

export class BaseApiClient implements IBaseApiClient {
    
    private url: string

    constructor(url: string) {
        this.url = url
    }

    getApi = async<T2>(endpoint: string, header?: AxiosRequestConfig): Promise<GenericResponse<T2>> => {
        try {
            let response: AxiosResponse<T2>
            if (typeof header !== 'undefined') {
                response = await axios.get(this.url + endpoint, header)
            }
            else {
                response = await axios.get(this.url + endpoint)
            }
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

    postApi = async<T1, T2>(endpoint: string, requestBody: T1, header?: AxiosRequestConfig): Promise<GenericResponse<T2>> => {
        try {
            let response: AxiosResponse<T2>
            if (typeof header !== 'undefined') {
                response = await axios.post(this.url + endpoint, requestBody, header)
            }
            else {
                response = await axios.post(this.url + endpoint, requestBody)
            }
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
