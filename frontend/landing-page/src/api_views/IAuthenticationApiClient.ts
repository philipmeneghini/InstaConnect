import { AxiosRequestConfig } from "axios"
import { RegisterFormValues } from "../components/RegisterForm"
import { GenericResponse, UserModel } from "./IBaseApiClient"

export interface LoginBody {
    email: string,
    password: string
}

export interface IAuthenticationApiClient {

    login: (email: string, password: string) => Promise<GenericResponse<string>>

    register: (RegisterFormValues: RegisterFormValues, header?: AxiosRequestConfig) => Promise<GenericResponse<UserModel>>
}