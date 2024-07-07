import { SwipingContextState } from "@/components/context/swiping"
import { ParserClothPostBody, ParserClothPostResponse } from "./api/parserCloth/route"
import { GenerativePostBody, GenerativePostResponse } from "./api/generative/route"
import { ParserHumanPostBody, ParserHumanPostResponse } from "./api/parserHuman/route"
import { OpenposePostBody, OpenposePostResponse } from "./api/openpose/route"

const fileNames = {
    'human': ["10549_00", "00891_00", "03615_00", "07445_00", "07573_00", "08909_00"],
    'cloth': ["11351_00", "11791_00", "01260_00", "01430_00", "02783_00", "03751_00", "06429_00", "06802_00", "07429_00", "08348_00", "09933_00", "11028_00"],
}

export const swipeCloth = async (swiping: SwipingContextState) => {
    const clothId = fileNames['cloth'][swiping.idxCloth]
    // const resultParserCloth = await api.parserHuman(image)
    // if (resultParserCloth.isOk()) {
    //     const image = resultParserCloth.unwrap().image
    //     clothMask = image
    //     setClothMask(image)
    // } else{
    //     console.error('resultParserCloth', resultParserCloth.unwrapErr())
    //     setClothMask(null)
    // }
    const bodyParserCloth: ParserClothPostBody = { id: clothId }
    const resultParserCloth = await fetch('/api/parserCloth', { method: 'POST', body: JSON.stringify(bodyParserCloth), headers: {'Content-Type': 'application/json' }});
    if (resultParserCloth.ok) {
        const { output_image, output_image_format }: ParserClothPostResponse = await resultParserCloth.json()
        return { clothMaskImage: output_image, clothMaskImageFormat: output_image_format }
    } else {
        console.error('resultParserCloth', await resultParserCloth.text())
        return { clothMaskImage: null, clothMaskImageFormat: null }
    }
}

export const swipeHuman = async (swiping: SwipingContextState) => {
    const humanId = fileNames['human'][swiping.idxHuman]

    const bodyOpenpose: OpenposePostBody = { id: humanId }
    const promiseOpenpose = await fetch('/api/openpose', { method: 'POST', body: JSON.stringify(bodyOpenpose), headers: {'Content-Type': 'application/json' }});

    const bodyParserHuman: ParserHumanPostBody = { id: humanId }
    const promiseParserHuman = await fetch('/api/parserHuman', { method: 'POST', body: JSON.stringify(bodyParserHuman), headers: {'Content-Type': 'application/json' }});

    let openposeImage: number[] | null = null
    let openposeImageFormat: string | null = null
    let openposeLabel: number[] | null = null
    let humanParserImage: number[] | null = null
    let humanParserImageFormat: string | null = null
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
                openposeImage = output_image
                openposeImageFormat = output_image_format
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
                humanParserImage = output_image
                humanParserImageFormat = output_image_format
            } else {
                console.error('resultParserHuman', await resultParserHuman.text())
            }            
        });

    return { openposeImage, openposeImageFormat, openposeLabel, humanParserImage, humanParserImageFormat }
}

export const swipeGenerative = async (
    openpose: number[],
    openposeLabel: number[],
    humanParser: number[],
    clothMask: number[],
    idxHuman?: number,
    humanFile?: string,
    idxCloth?: number,
    clothFile?: string,
) => {
    if ((!idxHuman && !humanFile) || (idxHuman && humanFile)) {
        console.error('resultGenerative', 'human_id or human_rgb')
        return { generativeImage: null, generativeImageFormat: null }
    }
    if ((!idxCloth && !clothFile) || (idxCloth && clothFile)) {
        console.error('resultGenerative', 'cloth_id or cloth_rgb')
        return { generativeImage: null, generativeImageFormat: null }
    }

    // const resultGenerative = await api.generative(openpose, openposeLabel, image, humanParser, cloth, clothMaskImage)
    // if (resultGenerative.isOk()) {
    //     setGenerative(resultGenerative.unwrap().image)
    // } else{
    //     console.error('resultGenerative', resultGenerative.unwrapErr())
    //     setGenerative(null)
    // }
    const bodyGenerative: GenerativePostBody = {
        pose_rgb: openpose,
        pose_label: openposeLabel,
        human_id: idxHuman ? fileNames['human'][idxHuman] : undefined,
        human_parse: humanParser,
        cloth_id: idxCloth ? fileNames['cloth'][idxCloth] : undefined,
        cloth_mask: clothMask,
        human_file: humanFile,
        cloth_file: clothFile,
    }
    const resultGenerative = await fetch('/api/generative', { method: 'POST', body: JSON.stringify(bodyGenerative), headers: {'Content-Type': 'application/json' }});
    if (resultGenerative.ok) {
        const { output_image, output_image_format }: GenerativePostResponse = await resultGenerative.json()
        return { generativeImage: output_image, generativeImageFormat: output_image_format }
    } else {
        console.error('resultGenerative', await resultGenerative.text())
        return { generativeImage: null, generativeImageFormat: null }
    }
}