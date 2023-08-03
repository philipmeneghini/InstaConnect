import { BaseApiClient } from './BaseApiClient'
import { GenericResponse, UserModel } from './IBaseApiClient'
import { IAuthenticationApiClient, JwtToken, LoginBody } from './IAuthenticationApiClient'
import { AuthEndpoint } from '../utils/Constants'
import { AxiosRequestConfig } from 'axios'

export class AuthenticationApiClient extends BaseApiClient implements IAuthenticationApiClient{

    constructor () {
        super(AuthEndpoint)
    }

    login = async(email: string, password: string): Promise<GenericResponse<string>> => {
        const response = await this.postApi<LoginBody, string>("login", {email: email, password: password})
        return {
            data: response.data as string ?? "",
            message: response.message ?? "",
            statusCode: response.statusCode
        }
    }

    register = async(email: string, password: string, header: AxiosRequestConfig): Promise<GenericResponse<UserModel>> => {
        const response = await this.postApi<LoginBody, UserModel>("Register", {email: email, password: password}, header)
        return {
            data: response.data as UserModel,
            message: response.message ?? "",
            statusCode: response.statusCode
        }
    }

    verifyToken = async(token: string): Promise<GenericResponse<JwtToken>> => {
        const response = await this.getApi<JwtToken>("VerifyToken?token=" + token)

        return {
            data: response.data as JwtToken,
            message: response.message ?? "",
            statusCode: response.statusCode
        }
    }
}