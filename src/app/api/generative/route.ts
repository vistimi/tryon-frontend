import { Api } from "@/services/api"
import { loadCloth, loadHuman } from "../load"

export interface GenerativePostBody {
    pose_rgb: Uint8Array
    pose_label: Uint8Array
    human_idx: string
    human_parse: Uint8Array
    cloth_idx: string
    cloth_mask: Uint8Array
}

export interface GenerativePostResponse {
    image: Uint8Array
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

    const human = await loadHuman(json.human_idx)
    const cloth = await loadCloth(json.cloth_idx)
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