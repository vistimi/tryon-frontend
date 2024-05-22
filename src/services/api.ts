// 'use client';

import { Ok, Err, Result } from 'ts-results-es';

export class Api {

    public static host: string;

    constructor() {
        const uri = process.env.AI_URL
        if (!uri) {
            throw new Error('Api host is not set')
        }
        Api.host = uri;
    }

    /** Functions general */

    public hostName = () => {
        return Api.host;
    }

    private handleRequest = async (path: string, requestOptions: RequestInit): Promise<Result<any, string>> => {
        let res: Response;
        try {
            res = await fetch(`${Api.host}${path}`, { 
                ...requestOptions,
            });
        } catch (error) {
            if (error instanceof Error) {
                return Err(`fetch error: ${error.message}, url: ${Api.host}${path}, requestOptions: ${JSON.stringify(requestOptions, null, 2)}`)
            }
            return Err(JSON.stringify(error))
        }
        if (!res) return Err('no response')

        let body:any;
        if (res.headers.get('content-type'))
        switch (res.headers.get('content-type')?.split(';')[0]) {
            case 'application/json':
                body = await res.json()
                break;
            case 'application/x-www-form-urlencoded':
                body = await res.formData()
                break;
            case 'text/html':
            case 'text/plain':
                const text = await res.text()
                body = text
                break;
            default:
                return Err(`unsupported content type: ${res.headers.get('content-type')}`)
        }

        if (!body) return Err('empty response')
        if (body.status >= 300 || res.status >= 300) return Err(`status: ${body.status || res.status} ${body.statusText || res.statusText}, message: ${JSON.stringify(body, null, 2)}`)
        return Ok(body)
    }

    private get = async (path: string, auth?: string, queryParams?: Record<string,any>): Promise<Result<any, string>> => {
        let headers: HeadersInit = {};
        if (auth) {
            headers = {
                'Authorization': auth
            }
        }
        const requestOptions: RequestInit = {
            method: 'GET',
            headers,
        }
        queryParams = Object.entries(queryParams || {}).reduce((acc, [key, value]) => {
            if (!!value) {
                acc[key] = value;
            }
            return acc;
          }, {} as Record<string,any>)
        const queryString = new URLSearchParams(queryParams).toString();
        if (queryString) {
            path += '?' + queryString
        }
        return this.handleRequest(path, requestOptions)
    }

    private post = async (path: string, auth?: string, queryParams?: Record<string,any>, body?: Record<string,any>): Promise<Result<any, string>> => {
        let headers: HeadersInit = {
            'Content-Type': 'application/json'
        };
        if (auth) {
            headers['Authorization'] = auth
        }
        const requestOptions: RequestInit = {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        }

        const Req = new Blob([JSON.stringify(body)]).size / (1024 * 1024);
        console.log(`Req size: ${Req} MB`);
        
        queryParams = Object.entries(queryParams || {}).reduce((acc, [key, value]) => {
            if (!!value) {
                acc[key] = value;
            }
            return acc;
          }, {} as Record<string,any>)
        const queryString = new URLSearchParams(queryParams).toString();
        if (queryString) {
            path += '?' + queryString
        }        
        return this.handleRequest(path, requestOptions)
    }

    private put = async (path: string, auth?: string, queryParams?: Record<string,any>, body?: Record<string,any>): Promise<Result<any, string>> => {
        let headers: HeadersInit = {
            'Content-Type': 'application/json'
        };
        if (auth) {
            headers['Authorization'] = auth
        }
        const requestOptions: RequestInit = {
            method: 'PUT',
            headers,
            body: JSON.stringify(body)
        }
        queryParams = Object.entries(queryParams || {}).reduce((acc, [key, value]) => {
            if (!!value) {
                acc[key] = value;
            }
            return acc;
          }, {} as Record<string,any>)
        const queryString = new URLSearchParams(queryParams).toString();
        if (queryString) {
            path += '?' + queryString
        }
        return this.handleRequest(path, requestOptions)
    }

    private patch = async (path: string, auth?: string, queryParams?: Record<string,any>, body?: Record<string,any>): Promise<Result<any, string>> => {
        let headers: HeadersInit = {
            'Content-Type': 'application/json'
        };
        if (auth) {
            headers['Authorization'] = auth
        }
        const requestOptions: RequestInit = {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body)
        }
        queryParams = Object.entries(queryParams || {}).reduce((acc, [key, value]) => {
            if (!!value) {
                acc[key] = value;
            }
            return acc;
          }, {} as Record<string,any>)
        const queryString = new URLSearchParams(queryParams).toString();
        if (queryString) {
            path += '?' + queryString
        }
        return this.handleRequest(path, requestOptions)
    }

    private delete = async (path: string, auth?: string, queryParams?: Record<string,any>): Promise<Result<any, string>> => {
        let headers: HeadersInit = {
            'Content-Type': 'application/json'
        };
        if (auth) {
            headers['Authorization'] = auth
        }
        const requestOptions: RequestInit = {
            method: 'DELETE',
            headers
        }
        queryParams = Object.entries(queryParams || {}).reduce((acc, [key, value]) => {
            if (!!value) {
                acc[key] = value;
            }
            return acc;
          }, {} as Record<string,any>)
        const queryString = new URLSearchParams(queryParams).toString();
        if (queryString) {
            path += '?' + queryString
        }
        return this.handleRequest(path, requestOptions)
    }

    /** API Gateway */
    public ping = async (): Promise<Result<{ message: string }, string>> => {
        return this.get(`/ping`)
    };

    /** AI */
    public parserHuman = async (image: Uint8Array): Promise<Result<{image: Uint8Array}, string>> => {
        return await this.post(`:8082/parser`, undefined, undefined, { image: image })
    };
    public parserHumanPing = async (): Promise<Result<{message: string}, string>> => {
        return await this.get(`:8082/ping`, undefined, undefined)
    };

    public parserCloth = async (image: Uint8Array): Promise<Result<{image: Uint8Array}, string>> => {
        return await this.post(`:8083/parser`, undefined, undefined, { image: image })
    };
    public parserClothPing = async (): Promise<Result<{message: string}, string>> => {
        return await this.get(`:8083/ping`, undefined, undefined)
    };

    public openpose = async (image: Uint8Array): Promise<Result<{image: Uint8Array, label: any}, string>> => {
        return await this.post(`:8081/openpose`, undefined, undefined, { image: image })
    };
    public openposePing = async (): Promise<Result<{message: string}, string>> => {
        return await this.get(`:8081/ping`, undefined, undefined)
    };

    public generative = async (
        pose_rgb: Uint8Array,
        pose_label: Uint8Array,
        human_rgb: Uint8Array,
        human_parse: Uint8Array,
        cloth_rgb: Uint8Array,
        cloth_mask: Uint8Array,
    ): Promise<Result<{image: Uint8Array}, string>> => {
        return await this.post(`:8080/generative`, undefined, undefined, { 
            pose_rgb,
            pose_label,
            human_rgb,
            human_parse,
            cloth_rgb,
            cloth_mask,
        })
    };
    public generativePing = async (): Promise<Result<{message: string}, string>> => {
        return await this.get(`:8080/ping`, undefined, undefined)
    };
}
