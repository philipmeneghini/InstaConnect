import { AxiosRequestConfig } from "axios"
import { EmailEndpoint } from "../utils/Constants"
import { BaseApiClient } from "./BaseApiClient"
import { GenericResponse, UserModel } from "./IBaseApiClient"
import { IEmailApiClient } from "./IEmailApiClient"

export class EmailApiClient extends BaseApiClient implements IEmailApiClient{

    constructor () {
        super(EmailEndpoint)
    }

    sendRegistrationEmail = async (user: UserModel, header?: AxiosRequestConfig) : Promise<GenericResponse<boolean>> => {
        const response = await this.postApi("registration", user, header)

        return {
            data: response.data as boolean,
            message: response.message ?? '',
            statusCode: response.statusCode
        }
    }
}