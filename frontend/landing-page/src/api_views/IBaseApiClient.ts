import { AxiosRequestConfig } from "axios"

export interface GenericResponse<T> {
    data?: T,
    message?: string,
    statusCode?: number
}

export interface UserModel {
    id?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    birthDate?: string,
    email?: string
}

export interface IBaseApiClient {

    postApi: <T1, T2>(endpoint: string, requestBody: T1, header?: AxiosRequestConfig) => Promise<GenericResponse<T2>>
}