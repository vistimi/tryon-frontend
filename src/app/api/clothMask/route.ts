import { Api } from "@/services/api"
import { loadCloth } from "../load";
import { decodeJpeg } from "@/util/image";

export interface ClothMaskPostBody {
    cloth_id?: string
    cloth_file?: string
}

export interface ClothMaskPostResponse {
    output_image: number[]
    output_image_format:string
}

export async function POST(request: Request) {
    let json: ClothMaskPostBody;
    const api = new Api();
    switch (request.headers.get('Content-Type')) {
        case 'application/json':
            json = await request.json();
            break;
        default:
            return new Response('Unsupported Media Type', { status: 415 });
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

    const result = await api.clothMask(cloth_buffer);
    if (result.isErr()) {
        console.error(result.unwrapErr(), { headers: request.headers, url: request.url })
        return Response.json({
            message: 'Bad Request',
            error: result.unwrapErr(),
        }, { status: 400 })
    }
    const body: ClothMaskPostResponse = result.unwrap()
    return Response.json(body, { status: 200 });
}

export async function GET(request: Request) {
    const api = new Api();
    const result = await api.clothMaskPing();
    if (result.isErr()) {
        console.error(result.unwrapErr(), { headers: request.headers, url: request.url })
        return Response.json({
            message: 'Bad Request',
            error: result.unwrapErr(),
        }, { status: 400 })
    }
    return Response.json(result.unwrap(), { status: 200 });
}