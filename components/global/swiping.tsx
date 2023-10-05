import Image from "next/image";
import { memo, Dispatch, MouseEvent, SetStateAction, createContext, useContext } from "react"
import { LoadingWheel } from "./loadingWheel";
import { Api } from "@services/api";

// context used for loading 
export type LoadingContextState = boolean
export const LoadingContext = createContext<{
    loading: LoadingContextState,
    setLoading: Dispatch<SetStateAction<LoadingContextState>>
}>({
    loading: false, setLoading: () => { }
});

// context used for results 
export type ResultContextState = string
export const ResultContext = createContext<{
    result: ResultContextState,
    setResult: Dispatch<SetStateAction<ResultContextState>>
}>({
    result: '', setResult: () => { }
});


// context used to store the current image or cloth
export type SwipingContextState = {
    idxImage: number
    idxCloth: number
}
export const SwipingContext = createContext<{
    swiping: SwipingContextState,
    setSwiping: Dispatch<SetStateAction<SwipingContextState>>
}>({ swiping: { idxImage: 0, idxCloth: 0 }, setSwiping: () => { } });


interface SwipingProps {
    imageType: 'image' | 'cloth'
    api: Api
}

export const Swiping = function Swiping(props: SwipingProps) {
    const { swiping, setSwiping } = useContext(SwipingContext);
    const { loading, setLoading } = useContext(LoadingContext);
    const { result, setResult } = useContext(ResultContext);

    const prediction = async (swiping: SwipingContextState) => {
        setLoading(true)
        const result = await props.api.prediction(fileNames['image'][swiping.idxImage], fileNames['cloth'][swiping.idxCloth])
        if (result.ok) {
            const base64String = btoa(String.fromCharCode(...new Uint8Array(result.val)));
            setLoading(false)
            setResult(base64String)
        } else {
            console.error(result.val)
            setLoading(false)
        }
    }

    const fileNames = {
        'image': ["00891_00", "03615_00", "07445_00", "07573_00", "08909_00", "10549_00"],
        'cloth': ["01260_00", "01430_00", "02783_00", "03751_00", "06429_00", "06802_00", "07429_00", "08348_00", "09933_00", "11028_00", "11351_00", "11791_00"],
    }

    const swipeLeft = (event: MouseEvent<SVGSVGElement>) => {
        let swipingPrev = swiping
        if (props.imageType == 'image') {
            swipingPrev = { ...swiping, idxImage: getIdx(swiping.idxImage - 1) }
        } else {
            swipingPrev = { ...swiping, idxCloth: getIdx(swiping.idxCloth - 1) }
        }
        prediction(swipingPrev)
        setSwiping(swipingPrev)
    }

    const swipeRight = (event: MouseEvent<SVGSVGElement>) => {
        let swipingPrev = swiping
        if (props.imageType == 'image') {
            swipingPrev = { ...swiping, idxImage: getIdx(swiping.idxImage + 1) }
        } else {
            swipingPrev = { ...swiping, idxCloth: getIdx(swiping.idxCloth + 1) }
        }
        prediction(swipingPrev)
        setSwiping(swipingPrev)
    }

    const getIdx = (idx: number) => {
        if (idx > fileNames[props.imageType].length - 1) {
            idx = idx - fileNames[props.imageType].length
        } else if (idx < 0) {
            idx = fileNames[props.imageType].length + idx
        }
        return idx
    }

    const getId = (increment: number = 0) => {
        if (props.imageType == 'image') {
            return fileNames[props.imageType][getIdx(swiping.idxImage + increment)]
        } else {
            return fileNames[props.imageType][getIdx(swiping.idxCloth + increment)]
        }
    }

    return (
        <div className="p-2 grid grid-cols-1" >
            <div className="p-2 grid grid-cols-10" >
                {loading ? <div className="z-10 row-span-full col-start-1 col-end-2 self-center">
                    <LoadingWheel />
                </div> : <svg
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="z-10 row-span-full col-start-1 col-end-2 self-center w-8 h-8 transition-transform transform hover:scale-110"
                    onClick={swipeLeft}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>}

                <Image
                    className="z-0 w-full h-auto row-span-full col-start-1 col-end-11 self-center object-cover rounded-xl shadow-md flex space-x-1"
                    src={`/dataset/${props.imageType}/${getId()}.jpg`}
                    alt={props.imageType == 'image' ? 'Model' : 'Cloth'}
                    width={0}
                    height={0}
                    sizes="100vw"
                    quality={50}
                    priority={false}
                />

                {loading ? <div className="z-10 row-span-full col-start-10 col-end-11 self-center">
                    <LoadingWheel />
                </div> : <svg
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="z-10 row-span-full col-start-10 col-end-11 self-center w-8 h-8 transition-transform transform hover:scale-110"
                    onClick={swipeRight}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>}
            </div >

            <div className="p-2 grid grid-cols-3" >
                <Image
                    className="z-0 w-full h-auto row-span-full col-start-1 col-end-2 self-center object-cover rounded-xl shadow-md flex space-x-1"
                    src={`/dataset/${props.imageType}/${getId(-1)}.jpg`}
                    alt={'Prev'}
                    width={0}
                    height={0}
                    sizes="100vw"
                    quality={10}
                    priority={false}
                />

                <Image
                    className="z-0 w-full h-auto row-span-full col-start-2 col-end-3 self-center object-cover rounded-xl shadow-md flex space-x-1"
                    src={`/dataset/${props.imageType}/${getId()}.jpg`}
                    alt={'Current'}
                    width={0}
                    height={0}
                    sizes="100vw"
                    quality={10}
                    priority={false}
                />

                <Image
                    className="z-0 w-full h-auto row-span-full col-start-3 col-end-4 self-center object-cover rounded-xl shadow-md flex space-x-1"
                    src={`/dataset/${props.imageType}/${getId(1)}.jpg`}
                    alt={'Next'}
                    width={0}
                    height={0}
                    sizes="100vw"
                    quality={10}
                    priority={false}
                />

            </div>
        </div>
    );
}
