import { Api } from "@/services/api"
import { loadCloth, loadHuman } from "../load"
import { decodeJpeg } from "@/util/image"

export interface GenerativePostBody {
    pose_rgb: number[]
    pose_label: number[]
    human_id?: string
    human_file?: string
    human_parse: number[]
    cloth_id?: string
    cloth_file?: string
    cloth_mask: number[]
}

export interface GenerativePostResponse {
    output_image: number[]
    output_image_format:string
}

export async function POST(request: Request) {
    let json: GenerativePostBody;
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
            error: 'human_id or human_file',
        }, { status: 400 });
    }

    let cloth_buffer: number[]
    if (json.cloth_id && !json.cloth_file) {
        cloth_buffer = await loadCloth(json.cloth_id)
        
    } else if (json.cloth_file && !json.cloth_id) {
        cloth_buffer = await decodeJpeg(json.cloth_file) 
    } else {
        return Response.json({
            message: 'Bad Request',
            error: 'cloth_id or cloth_file',
        }, { status: 400 })
    }

    const result = await api.generative(
        json.pose_rgb,
        json.pose_label,
        human_buffer,
        json.human_parse,
        cloth_buffer,
        json.cloth_mask
    );
    if (result.isErr()) {
        console.error(result.unwrapErr(), { headers: request.headers, url: request.url })
        return Response.json({
            message: 'Bad Request',
            error: result.unwrapErr(),
        }, { status: 400 })
    }
    const body: GenerativePostResponse = result.unwrap()
    return Response.json(body, { status: 200 });
}

export async function GET(request: Request) {
    const api = new Api();
    const result = await api.generativePing();
    if (result.isErr()) {
        console.error(result.unwrapErr(), { headers: request.headers, url: request.url })
        return Response.json({
            message: 'Bad Request',
            error: result.unwrapErr(),
        }, { status: 400 })
    }
    return Response.json(result.unwrap(), { status: 200 });
}