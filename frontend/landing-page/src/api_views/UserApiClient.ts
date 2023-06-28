import { BaseApiClient } from './BaseApiClient'
import { GenericResponse, UserModel } from './IBaseApiClient'
import { UserEndpoint } from '../utils/Constants'
import { IUserApiClient } from './IUserApiClient'

export class UserApiClient extends BaseApiClient implements IUserApiClient{

    constructor () {
        super(UserEndpoint)
    }

    createUser = async(user: UserModel): Promise<GenericResponse<UserModel>> => {
        const response = await this.postApi<UserModel, UserModel>("user", user)
        return {
            data: response.data,
            message: response.message ?? "",
            statusCode: response.statusCode
        }
    }
}