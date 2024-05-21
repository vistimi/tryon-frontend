import { MouseEvent, useContext } from "react"
import { Swiping } from "@/components/swiping";
import { SwipingContext, SwipingContextState } from "@/components/context/swiping";
import { LoadingContext } from "@/components/context/loading";
import { ImageContext } from "@/components/context/image";
import { GenerativePostBody, GenerativePostResponse } from "./api/generative/route";
import { OpenposePostBody, OpenposePostResponse } from "./api/openpose/route";
import { ParserHumanPostBody, ParserHumanPostResponse } from "./api/parserHuman/route";

interface SwipingHumanProps {}

export const SwipingHuman = ({}: SwipingHumanProps) => {
    const { swiping, setSwiping } = useContext(SwipingContext);
    const { loading, setLoading } = useContext(LoadingContext);
    const {
        setOpenpose,
        setOpenposeLabel,
        clothParser,
        setHumanParser,
        setGenerative
    } = useContext(ImageContext);
    const imageType = 'human'

    const swipe = async (swiping: SwipingContextState) => {
        setLoading(true)
        const clothIdx = fileNames['cloth'][swiping.idxCloth]
        const humanIdx = fileNames['human'][swiping.idxImage]

        const bodyOpenpose: OpenposePostBody = { idx: humanIdx }
        const promiseOpenpose = await fetch('/api/openpose', { method: 'POST', body: JSON.stringify(bodyOpenpose), headers: {'Content-Type': 'application/json' }});

        const bodyParserHuman: ParserHumanPostBody = { idx: humanIdx }
        const promiseParserHuman = await fetch('/api/parserHuman', { method: 'POST', body: JSON.stringify(bodyParserHuman), headers: {'Content-Type': 'application/json' }});

        // const promiseOpenpose = api.openpose(image)
        // const promiseParserHuman = api.parserHuman(image)
        let openpose : Uint8Array | null = null
        let openposeLabel : any | null = null
        let humanParser : Uint8Array | null = null
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
                    const { image, label }: OpenposePostResponse = await resultOpenpose.json()
                    openpose = image
                    setOpenpose(image)
                    openposeLabel = label
                    setOpenposeLabel(label)
                } else {
                    console.error('resultOpenpose', await resultOpenpose.text())
                    setOpenpose(null)
                    setOpenposeLabel(null)
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
                    const { image }: ParserHumanPostResponse = await resultParserHuman.json()
                    humanParser = image
                    setHumanParser(image)
                } else {
                    console.error('resultParserHuman', await resultParserHuman.text())
                    setHumanParser(null)
                }
            });

        if (openpose == null || openposeLabel == null || humanParser == null || clothParser == null) {
            setLoading(false)
            return
        }

        // const resultGenerative = await api.generative(openpose, openposeLabel, image, humanParser, cloth, clothParser)
        // if (resultGenerative.isOk()) {
        //     setGenerative(resultGenerative.unwrap().image)
        // } else{
        //     console.error('resultGenerative', resultGenerative.unwrapErr())
        //     setGenerative(null)
        // }
        const bodyGenerative: GenerativePostBody = {
            pose_rgb: openpose,
            pose_label: openposeLabel,
            human_idx: humanIdx,
            human_parse: humanParser,
            cloth_idx: clothIdx,
            cloth_mask: clothParser,
        }
        const resultGenerative = await fetch('/api/generative', { method: 'POST', body: JSON.stringify(bodyGenerative), headers: {'Content-Type': 'application/json' }});
        if (resultGenerative.ok) {
            const { image }: GenerativePostResponse = await resultGenerative.json()
            setGenerative(image)
        } else {
            console.error('resultGenerative', await resultGenerative.text())
            setGenerative(null)
        }
        
        setLoading(false)
        return
    }
    
    const fileNames = {
        'human': ["00891_00", "03615_00", "07445_00", "07573_00", "08909_00", "10549_00"],
        'cloth': ["01260_00", "01430_00", "02783_00", "03751_00", "06429_00", "06802_00", "07429_00", "08348_00", "09933_00", "11028_00", "11351_00", "11791_00"],
    }

    const swipeLeft = (event: MouseEvent<SVGSVGElement>) => {
        const swipingNew = { ...swiping, idxImage: getIdx(swiping.idxImage - 1) }
        swipe(swipingNew)
        setSwiping(swipingNew)
    }

    const swipeRight = (event: MouseEvent<SVGSVGElement>) => {
        const swipingNew = { ...swiping, idxImage: getIdx(swiping.idxImage + 1) }
        swipe(swipingNew)
        setSwiping(swipingNew)
    }

    const getIdx = (idx: number) => {
        if (idx > fileNames[imageType].length - 1) {
            idx = idx - fileNames[imageType].length
        } else if (idx < 0) {
            idx = fileNames[imageType].length + idx
        }
        return idx
    }

    const getId = (increment: number = 0) => {
        return fileNames[imageType][getIdx(swiping.idxImage + increment)]
    }

    return (
        <Swiping
            alt={imageType}
            imageSrc={`/dataset/${imageType}/${getId()}.jpg`}
            imageSrcs={[
                `/dataset/${imageType}/${getId(-1)}.jpg`,
                `/dataset/${imageType}/${getId()}.jpg`,
                `/dataset/${imageType}/${getId(1)}.jpg`,
            ]}
            loading={loading}
            swipeLeft={swipeLeft}
            swipeRight={swipeRight}
        />
    );
}
