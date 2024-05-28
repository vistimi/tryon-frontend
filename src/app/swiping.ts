import { SwipingContextState } from "@/components/context/swiping"
import { ParserClothPostBody, ParserClothPostResponse } from "./api/parserCloth/route"
import { GenerativePostBody, GenerativePostResponse } from "./api/generative/route"
import { ParserHumanPostBody, ParserHumanPostResponse } from "./api/parserHuman/route"
import { OpenposePostBody, OpenposePostResponse } from "./api/openpose/route"

const fileNames = {
    'human': ["00891_00", "03615_00", "07445_00", "07573_00", "08909_00", "10549_00"],
    'cloth': ["01260_00", "01430_00", "02783_00", "03751_00", "06429_00", "06802_00", "07429_00", "08348_00", "09933_00", "11028_00", "11351_00", "11791_00"],
}

export const swipeCloth = async (swiping: SwipingContextState) => {
    const clothId = fileNames['cloth'][swiping.idxCloth]
    // const resultParserCloth = await api.parserHuman(image)
    // if (resultParserCloth.isOk()) {
    //     const image = resultParserCloth.unwrap().image
    //     clothParser = image
    //     setClothParser(image)
    // } else{
    //     console.error('resultParserCloth', resultParserCloth.unwrapErr())
    //     setClothParser(null)
    // }
    const bodyParserCloth: ParserClothPostBody = { id: clothId }
    const resultParserCloth = await fetch('/api/parserCloth', { method: 'POST', body: JSON.stringify(bodyParserCloth), headers: {'Content-Type': 'application/json' }});
    if (resultParserCloth.ok) {
        const { output_image, output_image_format }: ParserClothPostResponse = await resultParserCloth.json()
        return { clothMask: output_image, clothMaskFormat: output_image_format }
    } else {
        console.error('resultParserCloth', await resultParserCloth.text())
        return { clothMask: null, clothMaskFormat: null }
    }
}

export const swipeHuman = async (swiping: SwipingContextState) => {
    const humanId = fileNames['human'][swiping.idxHuman]

    const bodyOpenpose: OpenposePostBody = { id: humanId }
    const promiseOpenpose = await fetch('/api/openpose', { method: 'POST', body: JSON.stringify(bodyOpenpose), headers: {'Content-Type': 'application/json' }});

    const bodyParserHuman: ParserHumanPostBody = { id: humanId }
    const promiseParserHuman = await fetch('/api/parserHuman', { method: 'POST', body: JSON.stringify(bodyParserHuman), headers: {'Content-Type': 'application/json' }});

    let openpose: number[] | null = null
    let openposeFormat: string | null = null
    let openposeLabel: number[] | null = null
    let humanParser: number[] | null = null
    let humanParserFormat: string | null = null
    await Promise
        .all([promiseOpenpose, promiseParserHuman])
        .then(async ([resultOpenpose, resultParserHuman]) => {                
            // if (resultOpenpose.isOk()) {
            //     const image = resultOpenpose.unwrap().image
            //     openpose = image
            //     setOpenpose(image)
            //     const label = resultOpenpose.unwrap().label
            //     openposeLabel = label
            //     setOpenposeLabel(label)
            // } else{
            //     console.error('resultOpenpose', resultOpenpose.unwrapErr())
            //     setOpenpose(null)
            //     setOpenposeLabel(null)
            // }            
            if (resultOpenpose.ok) {
                const { output_image, output_image_format, label }: OpenposePostResponse = await resultOpenpose.json()
                openpose = output_image
                openposeFormat = output_image_format
                openposeLabel = label
            } else {
                console.error('resultOpenpose', await resultOpenpose.text())
            }

            // if (resultParserHuman.isOk()) {
            //     const image = resultParserHuman.unwrap().image
            //     humanParser = image
            //     setHumanParser(image)
            // } else{
            //     console.error('resultParserHuman', resultParserHuman.unwrapErr())
            //     setHumanParser(null)
            // }            
            if (resultParserHuman.ok) {
                const { output_image, output_image_format }: ParserHumanPostResponse = await resultParserHuman.json()
                humanParser = output_image
                humanParserFormat = output_image_format
            } else {
                console.error('resultParserHuman', await resultParserHuman.text())
            }            
        });

    return { openpose, openposeFormat, openposeLabel, humanParser, humanParserFormat }
}

export const swipeGenerative = async (
    openpose: number[],
    openposeLabel: number[],
    humanParser: number[],
    clothParser: number[],
    idxHuman: number,
    idxCloth: number,
) => {
    const clothId = fileNames['cloth'][idxCloth]
    const humanId = fileNames['human'][idxHuman]

    // const resultGenerative = await api.generative(openpose, openposeLabel, image, humanParser, cloth, clothParserImage)
    // if (resultGenerative.isOk()) {
    //     setGenerative(resultGenerative.unwrap().image)
    // } else{
    //     console.error('resultGenerative', resultGenerative.unwrapErr())
    //     setGenerative(null)
    // }
    const bodyGenerative: GenerativePostBody = {
        pose_rgb: openpose,
        pose_label: openposeLabel,
        human_id: humanId,
        human_parse: humanParser,
        cloth_id: clothId,
        cloth_mask: clothParser,
    }
    const resultGenerative = await fetch('/api/generative', { method: 'POST', body: JSON.stringify(bodyGenerative), headers: {'Content-Type': 'application/json' }});
    if (resultGenerative.ok) {
        const { output_image, output_image_format }: GenerativePostResponse = await resultGenerative.json()
        return { generative: output_image, generativeFormat: output_image_format }
    } else {
        console.error('resultGenerative', await resultGenerative.text())
        return { generative: null, generativeFormat: null }
    }
}