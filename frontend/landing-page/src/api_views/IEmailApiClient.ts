import { AxiosRequestConfig } from "axios"
import { GenericResponse, UserModel } from "./IBaseApiClient"

export interface IEmailApiClient {

    sendRegistrationEmail: (user: UserModel, header: AxiosRequestConfig) => Promise<GenericResponse<boolean>>

    sendResetPasswordEmail: (user: UserModel, header: AxiosRequestConfig) => Promise<GenericResponse<boolean>>
}