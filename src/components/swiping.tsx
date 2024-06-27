import Image from "next/image";
import { LoadingWheel } from "./loadingWheel";

interface SwipingProps {
    alt: string
    alts: string[]
    imageSrc: string
    imageSrcs: string[]
    loading: boolean
    swipeLeft?: (event: any) => void
    swipeRight?: (event: any) => void
}

export const Swiping = ({imageSrcs, imageSrc, alt, loading, swipeLeft, swipeRight}: SwipingProps) => {
    return (
        <div className="p-2 grid grid-cols-1" >
            <div className="p-2 grid grid-cols-10" >
                {!loading && swipeLeft ? <svg
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black"
                    className="z-10 row-span-full col-start-1 col-end-2 self-center w-8 h-8 transition-transform transform hover:scale-110 text-black"
                    onClick={swipeLeft}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg> : <></>}

                {loading ? <div className="z-10 row-span-full col-start-5 col-end-6 self-center"><LoadingWheel /></div> : <></>}

                <Image
                    className="z-0 w-full h-auto row-span-full col-start-1 col-end-11 self-center object-cover rounded-xl shadow-md flex space-x-1"
                    src={imageSrc}
                    alt={alt}
                    width={0}
                    height={0}
                    sizes="100vw"
                    quality={50}
                    priority={false}
                />

                {!loading && swipeRight ? <svg
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black"
                    className="z-10 row-span-full col-start-10 col-end-11 self-center w-8 h-8 transition-transform transform hover:scale-110 text-black"
                    onClick={swipeRight}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg> : <></>}
            </div >

            <div className="p-2 grid grid-cols-3" >
                <Image
                    className="z-0 w-full h-auto row-span-full col-start-1 col-end-2 self-center object-cover rounded-xl shadow-md flex space-x-1"
                    src={imageSrcs[0]}
                    alt={'Prev'}
                    width={0}
                    height={0}
                    sizes="100vw"
                    quality={10}
                    priority={false}
                />

                <Image
                    className="z-0 w-full h-auto row-span-full col-start-2 col-end-3 self-center object-cover rounded-xl shadow-md flex space-x-1"
                    src={imageSrcs[1]}
                    alt={'Current'}
                    width={0}
                    height={0}
                    sizes="100vw"
                    quality={10}
                    priority={false}
                />

                <Image
                    className="z-0 w-full h-auto row-span-full col-start-3 col-end-4 self-center object-cover rounded-xl shadow-md flex space-x-1"
                    src={imageSrcs[2]}
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
