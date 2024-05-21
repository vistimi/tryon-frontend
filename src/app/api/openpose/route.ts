import { Api } from "@/services/api"
import { loadHuman } from "../load";

export interface OpenposePostBody {
    idx: string
}

export interface OpenposePostResponse {
    image: Uint8Array;
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

    const human = await loadHuman(json.idx)
    const result = await api.openpose(human);
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