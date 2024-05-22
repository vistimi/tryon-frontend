'use client'

import { useState } from "react";
import Image from "next/image"
import { SwipingHuman } from "./swipingHuman";
import { SwipingContext, SwipingContextState } from "@/components/context/swiping";
import { LoadingContext, LoadingContextState } from "@/components/context/loading";
import { ImageContext, ImageContextClothParser, ImageContextGenerative, ImageContextHumanParser, ImageContextOpenpose } from "@/components/context/image";
import { SwipingCloth } from "./swipingCloth";
import { Swiping } from "@/components/swiping";

export default function Home() {
	const [swiping, setSwiping] = useState<SwipingContextState>({ idxImage: 0, idxCloth: 0 })
	const [loading, setLoading] = useState<LoadingContextState>(false)
	const [openposeLabel, setOpenposeLabel] = useState<any>(null)
	const [openpose, setOpenpose] = useState<ImageContextOpenpose>(null)
	const [humanParser, setHumanParser] = useState<ImageContextHumanParser>(null)
	const [clothParser, setClothParser] = useState<ImageContextClothParser>(null)
	const [generative, setGenerative] = useState<ImageContextGenerative>(null)

	return (
		<section className="flex flex-col">
			<div className="flex items-center">
				{/* <Head>
					<title>Try-on</title>
					<meta name="description" content="Checkout our try-on" key="desc" />
					<meta property="og:title" content="Try-on" />
					<meta
					property="og:description"
					content=""
					/>
					<meta property="og:image" content="https://example.com/images/cool-page.jpg" />
				</Head> */}

				<div className="align-middle max-w-screen-2xl bg-default-100 rounded-xl shadow-md items-center space-x-1 grid grid-flow-col-dense grid-cols-6">
						<ImageContext.Provider 
							value={{
								openposeLabel, setOpenposeLabel,
								openpose, setOpenpose,								
								humanParser, setHumanParser,
								clothParser, setClothParser,
								generative, setGenerative
							}}
						>
							<LoadingContext.Provider value={{ loading, setLoading }}>
								<SwipingContext.Provider value={{ swiping, setSwiping }}>
									<div className="col-span-2">
										<SwipingHuman />
									</div>

									<div className="col-span-2">
										<SwipingCloth />
									</div>

									<div className="col-span-2">
										{
											(generative || openpose || humanParser || clothParser) && <Swiping
											alt="result"
											imageSrc={generative ? `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(generative)))}` : ''}
											imageSrcs={[
												openpose ? `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(openpose)))}` : '',
												humanParser ? `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(humanParser)))}` : '',
												clothParser ? `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(clothParser)))}` : '',
											]}
											loading={loading}
										/>
										}
									</div>
								</SwipingContext.Provider>
							</LoadingContext.Provider>
						</ImageContext.Provider>

						{/* <div className="col-span-2">
							<div className="p-2 grid grid-cols-1">
							<div className="p-2 items-center">
								{generative && <Image
								className="z-0 w-full h-auto row-span-full col-start-1 col-end-11 self-center object-cover rounded-xl shadow-md flex space-x-1"
								src={`data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(generative)))}`}
								// btoa(String.fromCharCode(...generative))
								alt={'AI Generated'}
								width={0}
								height={0}
								sizes="100vw"
								quality={75}
								priority={false}
								/>}
							</div>
							</div>
						</div> */}
				</div>
			</div >
		</section>
	);
}