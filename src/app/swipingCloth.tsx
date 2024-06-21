'use client'

import { MouseEvent, useContext } from "react"
import { Swiping } from "@/components/swiping";
import { SwipingContext, SwipingContextState } from "@/components/context/swiping";
import { LoadingContext } from "@/components/context/loading";
import { ImageContext } from "@/components/context/image";
import { swipeCloth, swipeGenerative, swipeHuman } from "./swiping";
import { readLocalStorage, removeLocalStorage, setLocalStorage } from "@/util/localstorage";
import { Human, Openpose } from "@/types/ai";
import { NoSsr } from "@/components/global/noSsr";

interface SwipingClothProps {}

export const SwipingCloth = ({}: SwipingClothProps) => {
    const { swiping, setSwiping } = useContext(SwipingContext);
    const { loading, setLoading } = useContext(LoadingContext);
    const {
        openpose, setOpenpose,
        clothMask, setClothMask,
        humanParser, setHumanParser,
        generative, setGenerative,
    } = useContext(ImageContext);
    const imageType = 'cloth'

    const swipe = async (swiping: SwipingContextState) => {
        setLoading(true)

        // Cloth Mask
        const { clothMaskImage: clothMaskImageNew, clothMaskImageFormat: clothMaskImageFormatNew } = await swipeCloth(swiping)
        if (clothMaskImageNew != null && clothMaskImageFormatNew != null) {
            setLocalStorage(clothMask.id, { image: clothMaskImageNew, format: clothMaskImageFormatNew })
            setClothMask({ ...clothMask})
        } else {
            removeLocalStorage(clothMask.id)
            setClothMask({ ...clothMask})            
        }

        // Human Parser and Openpose
        let openposeNew = readLocalStorage<Openpose>(openpose.id)
        let humanParserNew = readLocalStorage<Human>(humanParser.id)
        if (openposeNew == null || humanParserNew == null) {
            const { openposeImage, openposeImageFormat, openposeLabel, humanParserImage, humanParserImageFormat } = await swipeHuman(swiping)
            
            if (openposeImage != null && openposeImageFormat != null && openposeLabel != null) {
                openposeNew = { image: openposeImage, format: openposeImageFormat, label: openposeLabel }
                setLocalStorage(openpose.id, { image: openposeImage, format: openposeImageFormat, label: openposeLabel })
                setOpenpose({...openpose})
            } else {
                removeLocalStorage(openpose.id)
                setOpenpose({...openpose})                
            }
            
            if (humanParserImage != null && humanParserImageFormat != null) {
                humanParserNew = {image: humanParserImage, format: humanParserImageFormat}                
                setLocalStorage(humanParser.id, { image: humanParserImage, format: humanParserImageFormat })
                setHumanParser({...humanParser})
            } else {
                removeLocalStorage(humanParser.id)
                setHumanParser({...humanParser})                
            }
        }

        // Generative
        if (openposeNew != null && humanParserNew != null && clothMaskImageNew != null) {
            
            const { generativeImage, generativeImageFormat } = await swipeGenerative(openposeNew.image, openposeNew.label, humanParserNew.image, clothMaskImageNew, swiping.idxHuman, swiping.idxCloth)
            if (generativeImage != null && generativeImageFormat != null) {                
                setLocalStorage(generative.id, { image: generativeImage, format: generativeImageFormat })
                setGenerative({ ...generative})
            } else {
                removeLocalStorage(generative.id)
                setGenerative({ ...generative})                
            }
        }
        
        setSwiping({ idxHuman: swiping.idxHuman, idxCloth: swiping.idxCloth })
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

    const getId = (imageType: "human" | "cloth", idx: number, increment: number = 0) => {
        return fileNames[imageType][getIdx(idx + increment)]
    }

    return (
        <NoSsr>
            <Swiping
                alt={imageType}
                alts={['prev', 'current', 'next']}
                imageSrc={`/dataset/${imageType}/${getId(imageType, swiping.idxCloth)}.jpg`}
                imageSrcs={[
                    `/dataset/${imageType}/${getId(imageType, swiping.idxCloth,-1)}.jpg`,
                    `/dataset/${imageType}/${getId(imageType, swiping.idxCloth)}.jpg`,
                    `/dataset/${imageType}/${getId(imageType, swiping.idxCloth,1)}.jpg`,
                ]}
                loading={loading}
                swipeLeft={swipeLeft}
                swipeRight={swipeRight}
            />
        </NoSsr>
    );
}
