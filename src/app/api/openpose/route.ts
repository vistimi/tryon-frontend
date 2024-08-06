import { Api } from "@/services/api"
import { loadHuman } from "../load";
import { decodeJpeg } from "@/util/image";

export interface OpenposePostBody {
    human_id?: string
    human_file?: string
}

export interface OpenposePostResponse {
    output_image: number[]
    output_image_format:string
    label: any;
}

export async function POST(request: Request) {
    let json: OpenposePostBody;
    const api = new Api();
    switch (request.headers.get('Content-Type')) {
        case 'application/json':
            json = await request.json();
            break;
        default:
            return new Response('Unsupported Media Type', { status: 415 });
    }

    let human_buffer: number[]
    if (json.human_id && !json.human_file) {
        human_buffer = await loadHuman(json.human_id)
        
    } else if (json.human_file && !json.human_id) {
        human_buffer = await decodeJpeg(json.human_file) 
    } else {
        return Response.json({
            message: 'Bad Request',
            error: 'human_id or human_rgb',
        }, { status: 400 });
    }

    const result = await api.openpose(human_buffer);
    if (result.isErr()) {
        console.error(result.unwrapErr(), { headers: request.headers, url: request.url })
        return Response.json({
            message: 'Bad Request',
            error: result.unwrapErr(),
        }, { status: 400 })
    }
    const body: OpenposePostResponse = result.unwrap()
    return Response.json(body, { status: 200 });
    
}

export async function GET(request: Request) {
    const api = new Api();
    const result = await api.openposePing();
    if (result.isErr()) {
        console.error(result.unwrapErr(), { headers: request.headers, url: request.url })
        return Response.json({
            message: 'Bad Request',
            error: result.unwrapErr(),
        }, { status: 400 })
    }
    return Response.json(result.unwrap(), { status: 200 });
}