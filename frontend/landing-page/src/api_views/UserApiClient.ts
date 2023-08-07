import { BaseApiClient } from './BaseApiClient'
import { GenericResponse, UserModel } from './IBaseApiClient'
import { UserEndpoint } from '../utils/Constants'
import { IUserApiClient } from './IUserApiClient'
import { AxiosRequestConfig } from 'axios'

export class UserApiClient extends BaseApiClient implements IUserApiClient {

    constructor () {
        super(UserEndpoint)
    }

    createUser = async(user: UserModel, header: AxiosRequestConfig): Promise<GenericResponse<UserModel>> => {
        const response = await this.postApi<UserModel, UserModel>("user", user, header)
        return {
            data: response.data,
            message: response.message ?? "",
            statusCode: response.statusCode
        }
    }

    getUser = async(email: string, header: AxiosRequestConfig): Promise<GenericResponse<UserModel>> => {
        const response = await this.getApi<UserModel>(`user?email=${email}`, header)
        return {
            data: response.data,
            message: response.message ?? "",
            statusCode: response.statusCode
        }
    }
}