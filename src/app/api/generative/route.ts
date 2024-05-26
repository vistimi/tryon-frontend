import { Api } from "@/services/api"
import { loadCloth, loadHuman } from "../load"

export interface GenerativePostBody {
    pose_rgb: number[]
    pose_label: number[]
    human_id: string
    human_parse: number[]
    cloth_id: string
    cloth_mask: number[]
}

export interface GenerativePostResponse {
    image: number[]
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

    const human = await loadHuman(json.human_id)
    const cloth = await loadCloth(json.cloth_id)
    const result = await api.generative(
        json.pose_rgb,
        json.pose_label,
        human,
        json.human_parse,
        cloth,
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