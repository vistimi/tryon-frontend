import { MouseEvent, useContext } from "react"
import { Swiping } from "@/components/swiping";
import { SwipingContext, SwipingContextState } from "@/components/context/swiping";
import { LoadingContext } from "@/components/context/loading";
import { ImageContext } from "@/components/context/image";
import { swipeCloth, swipeGenerative, swipeHuman } from "./swiping";
import { readLocalStorage, removeLocalStorage, setLocalStorage } from "@/util/localstorage";

interface SwipingHumanProps {}

export const SwipingHuman = ({}: SwipingHumanProps) => {
    const { swiping, setSwiping } = useContext(SwipingContext);
    const { loading, setLoading } = useContext(LoadingContext);
    const {
        setOpenpose,
        clothParser, setClothParser,
        setHumanParser,
        setGenerative
    } = useContext(ImageContext);
    const imageType = 'human'

    const keyOpenpose = 'openpose'
	const keyHumanParser = 'human-parser'
	const keyClothParser = 'cloth-parser'
	const keyGenerative = 'generative'

    type Openpose = {image: number[], format: string, label:any}
	type Human = {image: number[], format: string}
	type Cloth = {image: number[], format: string}
	type Generative = {image: number[], format: string}

    const swipe = async (swiping: SwipingContextState) => {
        setLoading(true)
        
        const { openpose, openposeFormat, openposeLabel, humanParser, humanParserFormat } = await swipeHuman(swiping)
        if (openpose != null && openposeFormat != null && openposeLabel != null) {
            setLocalStorage(keyOpenpose, { image: openpose, format: openposeFormat, label: openposeLabel })
            setOpenpose({ id: keyOpenpose, timestamp: new Date().toISOString() })
        } else{
            setOpenpose(null)
            removeLocalStorage(keyOpenpose)
        }
        if (humanParser != null) {
            setHumanParser({ id: keyHumanParser, timestamp: new Date().toISOString() })
            setLocalStorage(keyHumanParser, { image: humanParser, format: humanParserFormat })
        } else {
            setHumanParser(null)
            removeLocalStorage(keyHumanParser)
        }

        let clothParserNew = clothParser != null ? readLocalStorage<Cloth>(clothParser.id) : null
        if (clothParser == null) {
            const { clothMask, clothMaskFormat } = await swipeCloth(swiping)
            if (clothMask != null && clothMaskFormat != null) {
                clothParserNew = { image: clothMask, format: clothMaskFormat }
                setLocalStorage(keyClothParser, { image: clothMask, format: clothMaskFormat })
                setClothParser({ id: keyClothParser, timestamp: new Date().toISOString() })
            } else {
                setClothParser(null)
                removeLocalStorage(keyClothParser)
            }
        }

        if (openpose != null && openposeLabel != null && humanParser != null && clothParserNew != null) {$
            // FIXME: first gen has one thing undefined
            const { generative, generativeFormat } = await swipeGenerative(openpose, openposeLabel, humanParser, clothParserNew.image, swiping.idxHuman, swiping.idxCloth)
            if (generative != null) {
                setGenerative({ id: keyGenerative, timestamp: new Date().toISOString() })
                setLocalStorage(keyGenerative, { image: generative, format: generativeFormat })
            } else {
                setGenerative(null)
                removeLocalStorage(keyGenerative)
            }
        }
        
        setLoading(false)
        return
    }
    
    const fileNames = {
        'human': ["00891_00", "03615_00", "07445_00", "07573_00", "08909_00", "10549_00"],
        'cloth': ["01260_00", "01430_00", "02783_00", "03751_00", "06429_00", "06802_00", "07429_00", "08348_00", "09933_00", "11028_00", "11351_00", "11791_00"],
    }

    const swipeLeft = (event: MouseEvent<SVGSVGElement>) => {
        const swipingNew = { ...swiping, idxHuman: getIdx(swiping.idxHuman - 1) }
        swipe(swipingNew)
        setSwiping(swipingNew)
    }

    const swipeRight = (event: MouseEvent<SVGSVGElement>) => {
        const swipingNew = { ...swiping, idxHuman: getIdx(swiping.idxHuman + 1) }
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
        return fileNames[imageType][getIdx(swiping.idxHuman + increment)]
    }

    return (
        <Swiping
            alt={imageType}
            alts={['prev', 'current', 'next']}
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
