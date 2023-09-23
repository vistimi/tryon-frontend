import { Ok, Err, Result } from 'ts-results';

export class Api {

    public static host = process.env.NEXT_PUBLIC_API_URL;

    constructor() {
        if (!Api.host) throw new Error('NEXT_PUBLIC_API_URL in env not defined');
        // this.handleRequest('/healthz', { method: 'GET' }).then(res => {
        //     if (!res.ok) {
        //         throw new Error(`api server not responding: ${res.val}`)
        //     }
        // })
    }

    /** Functions general */

    public hostName = () => {
        return Api.host;
    }

    // public static async fetch<T>(url: string, options: any): Promise<Result<T, string>> {
    //     const response = await fetch(url, options)
    //     if (!response.ok) {
    //         return Err(response.statusText)
    //     }
    //     return Ok(await response.json<T>())
    // }

    private handleRequest = async (path: string, requestOptions: FetchRequestInit): Promise<Result<any, string>> => {
        const res = await fetch(`${Api.host}${path}`, requestOptions);
        if (!res) return Err('no response')
        const responseObject = await res.json<any>()
        if (!responseObject) return Err('empty response')
        if (responseObject.status >= 300) return Err(`status: ${responseObject.status}, message: ${JSON.stringify(await responseObject, null, 2)}`)
        return Ok(responseObject)
    }

    private get = async (path: string, body: string): Promise<Result<any, string>> => {
        const requestOptions = {
            method: 'GET',
        }
        return this.handleRequest(path, requestOptions)
    }

    private post = async (path: string, body: string): Promise<Result<any, string>> => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        }
        return this.handleRequest(path, requestOptions)
    }

    private put = async (path: string, body: string): Promise<Result<any, string>> => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body
        }
        return this.handleRequest(path, requestOptions)
    }

    private delete = async (path: string, body?: string): Promise<Result<any, string>> => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body
        }
        return this.handleRequest(path, requestOptions)
    }

    public aiCompletion = async (prompt: string): Promise<Result<{ code?: string, error?: string }, string>> => {
        return await this.put(`/ai/completion`, prompt)
    };
}