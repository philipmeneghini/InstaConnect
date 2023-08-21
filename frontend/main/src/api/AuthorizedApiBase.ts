import { AxiosRequestConfig } from 'axios'

export class AuthorizedApiBase {
    protected transformOptions = (options: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
        options.transformResponse = (data: any) => data
        options.headers = {
        ...options.headers,
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
        return Promise.resolve(options)
    }
}