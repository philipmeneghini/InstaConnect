import { GenericResponse, UserModel } from "./IBaseApiClient"

export interface IUserApiClient {

    createUser: (user: UserModel) => Promise<GenericResponse<UserModel>>
}