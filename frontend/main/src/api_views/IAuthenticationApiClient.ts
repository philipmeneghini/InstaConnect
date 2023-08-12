import { AxiosRequestConfig } from "axios"
import { GenericResponse, UserModel } from "./IBaseApiClient"

export interface LoginBody {
    email: string,
    password: string
}

export interface JwtToken {
    email: string,
    fullName: string,
    birthDate: string
}

export interface IAuthenticationApiClient {

    login: (email: string, password: string) => Promise<GenericResponse<string>>

    register: (email: string, password: string, header: AxiosRequestConfig) => Promise<GenericResponse<UserModel>>

    verifyToken: (token: string) => Promise<GenericResponse<JwtToken>>
}