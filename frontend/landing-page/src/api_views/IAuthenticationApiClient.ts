export interface LoginResponse {
    token: string,
    message: string,
    statusCode?: number
}

export interface LoginBody {
    email: string,
    password: string
}

export interface IAuthenticationApiClient {

    login: (email: string, password: string) => Promise<LoginResponse>
}