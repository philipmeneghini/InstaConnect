import { BaseApiClient } from './BaseApiClient'
import { IAuthenticationApiClient, LoginResponse, LoginBody } from './IAuthenticationApiClient'
import { AuthEndpoint } from '../utils/Constants'

export class AuthenticationApiClient extends BaseApiClient implements IAuthenticationApiClient{

    constructor () {
        super(AuthEndpoint)
    }

    login = async(email: string, password: string): Promise<LoginResponse> => {
        console.log(email)
        console.log(password)
        const response = await this.postApi<LoginBody, string>("login", {email: email, password: password})
        return {
            token: response.data as string ?? "",
            message: response.message ?? "",
            statusCode: response.statusCode
        }
    }
}