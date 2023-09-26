import Image from "next/image";
import { Dispatch, MouseEvent, SetStateAction, createContext, useContext } from "react"

// context used to store the current image or cloth
export type SwipingContextState = {
    idx: number
    id: string
}
export const SwipingContext = createContext<{
    state: SwipingContextState,
    setState: Dispatch<SetStateAction<SwipingContextState>>
}>({ state: { idx: -1, id: '' }, setState: () => { } });


interface SwipingProps {
    imageType: 'image' | 'cloth'
}

export const Swiping = (props: SwipingProps): JSX.Element => {
    const { state, setState } = useContext(SwipingContext);

    const fileNames = {
        'image': ["00891_00", "03615_00", "07445_00", "07573_00", "08909_00", "10549_00"],
        'cloth': ["01260_00", "01430_00", "02783_00", "03751_00", "06429_00", "06802_00", "07429_00", "08348_00", "09933_00", "11028_00", "11351_00", "11791_00"],
    }

    const swipeLeft = (event: MouseEvent<SVGSVGElement>) => {
        if (state.idx == 0) {
            setState({ idx: fileNames[props.imageType].length - 1, id: fileNames[props.imageType][fileNames[props.imageType].length - 1] })
        } else {
            setState({ idx: state.idx - 1, id: fileNames[props.imageType][state.idx - 1] })
        }
    }

    const swipeRight = (event: MouseEvent<SVGSVGElement>) => {
        if (state.idx == fileNames[props.imageType].length - 1) {
            setState({ idx: 0, id: fileNames[props.imageType][0] })
        } else {
            setState({ idx: state.idx + 1, id: fileNames[props.imageType][state.idx + 1] })
        }
    }

    return (
        <div className="p-6 grid grid-cols-10" >
            <svg
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="z-10 row-span-full col-start-1 col-end-2 self-center w-8 h-8 transition-transform transform hover:scale-110"
                onClick={swipeLeft}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <Image
                className="z-0 w-full h-auto row-span-full col-start-1 col-end-11 self-center object-cover rounded-xl shadow-md flex space-x-1"
                src={`/dataset/${props.imageType}/${fileNames[props.imageType][state.idx]}.jpg`}
                alt={props.imageType == 'image' ? 'Model' : 'Cloth'}
                width={0}
                height={0}
                sizes="100vw"
                quality={50}
                priority={false}
            />

            <svg
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="z-10 row-span-full col-start-10 col-end-11 self-center w-8 h-8 transition-transform transform hover:scale-110"
                onClick={swipeRight}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div >
    );
}
