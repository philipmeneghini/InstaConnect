import { BaseApiClient } from './BaseApiClient'
import { GenericResponse, UserModel } from './IBaseApiClient'
import { IAuthenticationApiClient, LoginBody } from './IAuthenticationApiClient'
import { AuthEndpoint } from '../utils/Constants'
import { RegisterFormValues } from '../components/RegisterForm'
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

    register = async(registerForm: RegisterFormValues, header?: AxiosRequestConfig): Promise<GenericResponse<UserModel>> => {
        let response: GenericResponse<UserModel>
        if (typeof header !== 'undefined') {
            response = await this.postApi<RegisterFormValues, UserModel>("Register", {firstName: registerForm.firstName,
                lastName: registerForm.lastName,
                email: registerForm.email,
                birthDate: registerForm.birthDate}, header)
        }
        else {
            response = await this.postApi<RegisterFormValues, UserModel>("Register", {firstName: registerForm.firstName,
                lastName: registerForm.lastName,
                email: registerForm.email,
                birthDate: registerForm.birthDate})
        }
        return {
            data: response.data as UserModel,
            message: response.message ?? "",
            statusCode: response.statusCode
        }
    }
}