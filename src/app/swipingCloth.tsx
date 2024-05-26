import { MouseEvent, useContext } from "react"
import { Api } from "@/services/api";
import { Swiping } from "@/components/swiping";
import { SwipingContext, SwipingContextState } from "@/components/context/swiping";
import { LoadingContext } from "@/components/context/loading";
import { ImageContext } from "@/components/context/image";
import { swipeCloth, swipeGenerative, swipeHuman } from "./swiping";

interface SwipingClothProps {}

export const SwipingCloth = ({}: SwipingClothProps) => {
    const { swiping, setSwiping } = useContext(SwipingContext);
    const { loading, setLoading } = useContext(LoadingContext);
    const {
        openpose, setOpenpose,
        openposeLabel, setOpenposeLabel,
        setClothParser,
        humanParser, setHumanParser,
        setGenerative,
    } = useContext(ImageContext);
    const imageType = 'cloth'

    const swipe = async (swiping: SwipingContextState) => {
        setLoading(true)

        const clothParser = await swipeCloth(swiping)
        setClothParser(clothParser)

        let openposeNew = openpose
        let openposeLabelNew = openposeLabel
        let humanParserNew = humanParser
        if (openpose == null || openposeLabel == null || humanParser == null) {
            const { openpose, openposeLabel, humanParser } = await swipeHuman(swiping)
            openposeNew = openpose
            openposeLabelNew = openposeLabel
            humanParserNew = humanParser
            setOpenpose(openpose)
            setOpenposeLabel(openposeLabel)
            setHumanParser(humanParser)
        }

        if (openposeNew != null && openposeLabelNew != null && humanParserNew != null && clothParser != null) {
            const generative = await swipeGenerative(openposeNew, openposeLabelNew, humanParserNew, clothParser, swiping.idxHuman, swiping.idxCloth)
            setGenerative(generative)
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
