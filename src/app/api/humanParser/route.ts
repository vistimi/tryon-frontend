import { Api } from "@/services/api"
import { loadHuman } from "../load";
import { decodeJpeg } from "@/util/image";

export interface HumanParserPostBody {
    human_id?: string
    human_file?: string
}

export interface HumanParserPostResponse {
    output_image: number[]
    output_image_format:string
}

export async function POST(request: Request) {
    let json: HumanParserPostBody;
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

    const result = await api.humanParser(human_buffer);
    if (result.isErr()) {
        console.error(result.unwrapErr(), { headers: request.headers, url: request.url })
        return Response.json({
            message: 'Bad Request',
            error: result.unwrapErr(),
        }, { status: 400 })
    }
    const body: HumanParserPostResponse = result.unwrap()
    return Response.json(body, { status: 200 });
}

export async function GET(request: Request) {
    const api = new Api();
    const result = await api.humanParserPing();
    if (result.isErr()) {
        console.error(result.unwrapErr(), { headers: request.headers, url: request.url })
        return Response.json({
            message: 'Bad Request',
            error: result.unwrapErr(),
        }, { status: 400 })
    }
    return Response.json(result.unwrap(), { status: 200 });
}