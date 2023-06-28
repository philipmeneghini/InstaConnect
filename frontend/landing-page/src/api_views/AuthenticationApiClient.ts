import { BaseApiClient } from './BaseApiClient'
import { GenericResponse, UserModel } from './IBaseApiClient'
import { IAuthenticationApiClient, LoginBody } from './IAuthenticationApiClient'
import { AuthEndpoint } from '../utils/Constants'
import { RegisterFormValues } from '../components/RegisterForm'

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

    register = async(registerForm: RegisterFormValues): Promise<GenericResponse<UserModel>> => {
        const response = await this.postApi<RegisterFormValues, UserModel>("Register", {firstName: registerForm.firstName,
            lastName: registerForm.lastName,
            email: registerForm.email,
            dateOfBirth: registerForm.dateOfBirth})
        return {
            data: response.data as UserModel,
            message: response.message ?? "",
            statusCode: response.statusCode
        }
    }
}