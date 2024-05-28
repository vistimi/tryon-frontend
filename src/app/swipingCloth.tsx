import { MouseEvent, useContext } from "react"
import { Swiping } from "@/components/swiping";
import { SwipingContext, SwipingContextState } from "@/components/context/swiping";
import { LoadingContext } from "@/components/context/loading";
import { ImageContext } from "@/components/context/image";
import { swipeCloth, swipeGenerative, swipeHuman } from "./swiping";
import { readLocalStorage, removeLocalStorage, setLocalStorage } from "@/util/localstorage";

interface SwipingClothProps {}

export const SwipingCloth = ({}: SwipingClothProps) => {
    const { swiping, setSwiping } = useContext(SwipingContext);
    const { loading, setLoading } = useContext(LoadingContext);
    const {
        openpose, setOpenpose,
        setClothParser,
        humanParser, setHumanParser,
        setGenerative,
    } = useContext(ImageContext);
    const imageType = 'cloth'

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

        const { clothMask, clothMaskFormat } = await swipeCloth(swiping)
        if (clothMask != null && clothMaskFormat != null) {
            setLocalStorage(keyClothParser, { image: clothMask, format: clothMaskFormat })
            setClothParser({ id: keyClothParser, timestamp: new Date().toISOString() })
        } else {
            setClothParser(null)
            removeLocalStorage(keyClothParser)
        }        
        

        let openposeNew = openpose != null ? readLocalStorage<Openpose>(openpose.id) : null
        let humanParserNew = humanParser != null ? readLocalStorage<Human>(humanParser.id) : null
        if (openpose == null || humanParser == null) {
            const { openpose, openposeFormat, openposeLabel, humanParser, humanParserFormat } = await swipeHuman(swiping)
            
            if (openpose != null && openposeFormat != null && openposeLabel != null) {
                openposeNew = { image: openpose, format: openposeFormat, label: openposeLabel}
                setLocalStorage(keyOpenpose, { image: openpose, format: openposeFormat, label: openposeLabel })
                setOpenpose({ id: keyOpenpose, timestamp: new Date().toISOString() })
            } else{
                setOpenpose(null)
                removeLocalStorage(keyOpenpose)
            }

            
            if (humanParser != null) {
                humanParserNew = humanParser
                setHumanParser({ id: keyHumanParser, timestamp: new Date().toISOString() })
                setLocalStorage(keyHumanParser, { image: humanParser, format: humanParserFormat })
            } else {
                setHumanParser(null)
                removeLocalStorage(keyHumanParser)
            }
            
        }

        if (openposeNew != null && humanParserNew != null && clothMask != null) {
            // FIXME: first gen has one thing undefined
            const { generative, generativeFormat } = await swipeGenerative(openposeNew.image, openposeNew.label, humanParserNew.image, clothMask, swiping.idxHuman, swiping.idxCloth)
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
        const swipingNew = { ...swiping, idxCloth: getIdx(swiping.idxCloth - 1) }
        swipe(swipingNew)
        setSwiping(swipingNew)
    }

    const swipeRight = (event: MouseEvent<SVGSVGElement>) => {
        const swipingNew = { ...swiping, idxCloth: getIdx(swiping.idxCloth + 1) }
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
        return fileNames[imageType][getIdx(swiping.idxCloth + increment)]
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
