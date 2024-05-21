import { Api } from "@/services/api"
import { loadHuman } from "../load";

export interface ParserHumanPostBody {
    idx: string
}

export interface ParserHumanPostResponse {
    image: Uint8Array;
}

export async function POST(request: Request) {
    let json: ParserHumanPostBody;
    const api = new Api();
    switch (request.headers.get('Content-Type')) {
        case 'application/json':
            json = await request.json();
            break;
        default:
            return new Response('Unsupported Media Type', { status: 415 });
    }

    const human = await loadHuman(json.idx)
    const result = await api.parserHuman(human);
    if (result.isErr()) {
        console.error(result.unwrapErr(), { headers: request.headers, url: request.url })
        return Response.json({
            message: 'Bad Request',
            error: result.unwrapErr(),
        }, { status: 400 })
    }
    const body: ParserHumanPostResponse = result.unwrap()
    return Response.json(body, { status: 200 });
}