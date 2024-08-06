// 'use client';

import { aiConfig, AiConfig } from '@/config/ai';
import { Ok, Err, Result } from 'ts-results-es';

export class Api {

    public static conf: AiConfig;

    constructor() {
        const conf = aiConfig;

        if (!conf) {
            throw new Error('Api host is not set')
        }
        Api.conf = conf;
    }

    /** Functions general */

    private handleRequest = async (url: string, requestOptions: RequestInit): Promise<Result<any, string>> => {
        let res: Response;
        try {
            res = await fetch(url, { 
                ...requestOptions,
            });
        } catch (error) {
            if (error instanceof Error) {
                return Err(`fetch error: ${error.message}, url: ${url}, requestOptions: ${JSON.stringify(requestOptions, null, 2)}`)
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

    // /** API Gateway */
    // public ping = async (): Promise<Result<{ message: string }, string>> => {
    //     return this.get(`/ping`)
    // };

    /** AI */
    // public parserHuman = async (image: number[]): Promise<Result<{output_image: number[], output_image_format:string}, string>> => {
    //     if (!Array.isArray(image)) {
    //         return Err(`Image must be a list, image ${typeof image}`);
    //     }
    //     return await this.post(`${Api.conf.humanParser.inference}/predictions/unet`, undefined, undefined, { image: image, image_format: 'jpeg' })
    // };
    // public parserHumanPing = async (): Promise<Result<{message: string}, string>> => {
    //     return await this.get(`${Api.conf.humanParser.inference}/ping`, undefined, undefined)
    // };

    // public parserCloth = async (image: number[]): Promise<Result<{output_image: number[], output_image_format:string}, string>> => {
    //     if (!Array.isArray(image)) {
    //         return Err(`Image must be a list, image ${typeof image}`);
    //     }
    //     return await this.post(`${Api.conf.clothMask.inference}/predictions/unet`, undefined, undefined, { image: image, image_format: 'jpeg' })
    // };
    // public parserClothPing = async (): Promise<Result<{message: string}, string>> => {
    //     return await this.get(`${Api.conf.clothMask.inference}/ping`, undefined, undefined)
    // };

    // public openpose = async (image: number[]): Promise<Result<{output_image: number[], output_image_format:string, label: any}, string>> => {
    //     if (!Array.isArray(image)) {
    //         return Err(`Image must be a list, image ${typeof image}`);
    //     }
    //     return await this.post(`${Api.conf.openpose.inference}/predictions/openpose`, undefined, undefined, { image: image, image_format: 'jpeg', output_image_quality: 50, })
    // };
    // public openposePing = async (): Promise<Result<{message: string}, string>> => {
    //     return await this.get(`${Api.conf.openpose.inference}/ping`, undefined, undefined)
    // };

    // public generative = async (
    //     pose_rgb: number[],
    //     pose_label: number[],
    //     human_rgb: number[],
    //     human_parse: number[],
    //     cloth_rgb: number[],
    //     cloth_mask: number[],
    // ): Promise<Result<{output_image: number[], output_image_format:string}, string>> => {
    //     // if (!Array.isArray(pose_rgb) || !Array.isArray(pose_label) || !Array.isArray(human_rgb) || !Array.isArray(human_parse) || !Array.isArray(cloth_rgb) || !Array.isArray(cloth_mask)){
    //     //     return Err(`Image must be a list, pose_rgb ${typeof pose_rgb}, pose_label ${typeof pose_label}, human_rgb ${typeof human_rgb}, human_parse ${typeof human_parse}, cloth_rgb ${typeof cloth_rgb}, cloth_mask ${typeof cloth_mask}`);
    //     // }
    //     return await this.post(`${Api.conf.vton.inference}/wfpredict/vton-hd`, undefined, undefined, { 
    //         pose_rgb,
    //         pose_label,
    //         human_rgb,
    //         human_parse,
    //         cloth_rgb,
    //         cloth_mask,
    //         output_image_quality: 20,
    //     })
    // };
    // public generativePing = async (): Promise<Result<{message: string}, string>> => {
    //     return await this.get(`${Api.conf.vton.inference}/ping`, undefined, undefined)
    // };

    public humanParser = async (image: number[]): Promise<Result<{output_image: number[], output_image_format:string}, string>> => {
        if (!Array.isArray(image)) {
            return Err(`Image must be a list, image ${typeof image}`);
        }
        return await this.post(`${Api.conf.humanParser}/prediction`, undefined, undefined, { image: image, image_format: 'jpeg' })
    };
    public humanParserPing = async (): Promise<Result<{message: string}, string>> => {
        return await this.get(`${Api.conf.humanParser}/ping`, undefined, undefined)
    };

    public clothMask = async (image: number[]): Promise<Result<{output_image: number[], output_image_format:string}, string>> => {
        if (!Array.isArray(image)) {
            return Err(`Image must be a list, image ${typeof image}`);
        }
        return await this.post(`${Api.conf.clothMask}/prediction`, undefined, undefined, { image: image, image_format: 'jpeg', 'normalize': true })
    };
    public clothMaskPing = async (): Promise<Result<{message: string}, string>> => {
        return await this.get(`${Api.conf.clothMask}/ping`, undefined, undefined)
    };

    public openpose = async (image: number[]): Promise<Result<{output_image: number[], output_image_format:string, label: any}, string>> => {
        if (!Array.isArray(image)) {
            return Err(`Image must be a list, image ${typeof image}`);
        }
        return await this.post(`${Api.conf.openpose}/prediction`, undefined, undefined, { image: image, image_format: 'jpeg', output_image_quality: 50, })
    };
    public openposePing = async (): Promise<Result<{message: string}, string>> => {
        return await this.get(`${Api.conf.openpose}/ping`, undefined, undefined)
    };

    public generative = async (
        pose_rgb: number[],
        pose_label: number[],
        human_rgb: number[],
        human_parse: number[],
        cloth_rgb: number[],
        cloth_mask: number[],
    ): Promise<Result<{output_image: number[], output_image_format:string}, string>> => {
        // if (!Array.isArray(pose_rgb) || !Array.isArray(pose_label) || !Array.isArray(human_rgb) || !Array.isArray(human_parse) || !Array.isArray(cloth_rgb) || !Array.isArray(cloth_mask)){
        //     return Err(`Image must be a list, pose_rgb ${typeof pose_rgb}, pose_label ${typeof pose_label}, human_rgb ${typeof human_rgb}, human_parse ${typeof human_parse}, cloth_rgb ${typeof cloth_rgb}, cloth_mask ${typeof cloth_mask}`);
        // }
        return await this.post(`${Api.conf.vton}/prediction`, undefined, undefined, { 
            pose_rgb,
            pose_label,
            human_rgb,
            human_parse,
            cloth_rgb,
            cloth_mask,
            output_image_quality: 20,
        })
    };
    public generativePing = async (): Promise<Result<{message: string}, string>> => {
        return await this.get(`${Api.conf.vton}/ping`, undefined, undefined)
    };
}
