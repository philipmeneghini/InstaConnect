import { AxiosRequestConfig } from "axios"
import { GenericResponse, UserModel } from "./IBaseApiClient"

export interface IUserApiClient {

    createUser: (user: UserModel, header: AxiosRequestConfig) => Promise<GenericResponse<UserModel>>
}