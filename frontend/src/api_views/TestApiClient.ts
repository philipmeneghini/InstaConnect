import axios from 'axios'

export class TestApiClient {
    private url: string

    constructor(url: string) {
        this.url = url
    }

    getMessage = async(): Promise<string> => {
        try{
            const response = await axios.get(this.url)
            return response.data
        }
        catch(error: any) {
            throw new error
        }
    }
}