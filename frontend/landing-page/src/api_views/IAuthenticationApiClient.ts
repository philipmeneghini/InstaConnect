import { GenericResponse } from "./IBaseApiClient"

export interface LoginBody {
    email: string,
    password: string
}

export interface UserModel {
    id?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    birthDate?: string,
    email?: string
}

export interface IAuthenticationApiClient {

    login: (email: string, password: string) => Promise<GenericResponse<string>>
}