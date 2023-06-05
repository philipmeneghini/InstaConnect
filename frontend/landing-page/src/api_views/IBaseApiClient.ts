export interface GenericResponse<T> {
    data?: T,
    message?: string,
    statusCode?: number
}

export interface IBaseApiClient {

    postApi: <T1, T2>(endpoint: string, requestBody: T1) => Promise<GenericResponse<T2>>
}