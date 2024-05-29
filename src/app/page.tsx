'use client'

import { useEffect, useState } from "react";
import { SwipingHuman } from "./swipingHuman";
import { SwipingContext, SwipingContextState } from "@/components/context/swiping";
import { LoadingContext, LoadingContextState } from "@/components/context/loading";
import { ImageContext, ImageContextclothMask, ImageContextGenerative, ImageContextHumanParser, ImageContextOpenpose } from "@/components/context/image";
import { SwipingCloth } from "./swipingCloth";
import { Swiping } from "@/components/swiping";
import { readLocalStorage } from "@/util/localstorage";
import usePersistState from "@/util/hooks/usePersistState";
import { Cloth, Generative, Human, Openpose } from "@/types/ai";

export default function Home() {
	const [swiping, setSwiping] = usePersistState<SwipingContextState>({ idxHuman: 0, idxCloth: 0 }, 'idx')
	const [loading, setLoading] = useState<LoadingContextState>(false)

	const [openpose, setOpenpose] = useState<ImageContextOpenpose>({id: 'openpose'})
	const [humanParser, setHumanParser] = useState<ImageContextHumanParser>({id: 'human-parser'})
	const [clothMask, setClothMask] = useState<ImageContextclothMask>({id: 'cloth-parser'})
	const [generative, setGenerative] = useState<ImageContextGenerative>({id: 'generative'})

	const formatImage = (data: number[], scale?:boolean): Promise<null | string> => {
		return new Promise((resolve, reject) => {
			const src = `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(data)))}`
			if (!scale) resolve(src)
			
			if (scale) {
				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')
				if (!ctx || !canvas) {
					resolve(null)
					return
				}
				const image = new Image()
				image.src = src
				image.onload = () => {
					canvas.width = image.width
					canvas.height = image.height
					ctx.drawImage(image, 0, 0, image.width, image.height)
					let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
					let data = imageData.data
					let max = 0
					for (let i = 0; i < data.length; i += 4) {
						const pixelValue = Math.max(data[i], data[i + 1], data[i + 2])
						max = Math.max(max, pixelValue)
					}
					const scale = 256 / max
					for (let i = 0; i < data.length; i += 4) {
						data[i]     = data[i] * scale     // Red channel
						data[i + 1] = data[i + 1] * scale // Green channel
						data[i + 2] = data[i + 2] * scale // Blue channel
					}
					ctx.putImageData(imageData, 0, 0)
					const base64Image = canvas.toDataURL("image/png");
					resolve(base64Image)
				}
				image.onerror = (err) => {
					reject(err);
				}
			}
		});
	}

	const [humanParserImageScaled, setHumanParserImageScaled] = useState<null|string>(null)
	const [clothMaskImageScaled, setClothMaskImageScaled] = useState<null|string>(null)
	const [openposeImageScaled, setOpenposeImageScaled] = useState<null|string>(null)
	const [generativeImageScaled, setGenerativeImageScaled] = useState<null|string>(null)
	useEffect(() => {		
		(async () => {
			const data = readLocalStorage<Human>(humanParser.id)?.image
			if (!data) return
			const base64Image = await formatImage(data, true)
			setHumanParserImageScaled(base64Image)
		})()
	}, [humanParser])
	useEffect(() => {
		(async () => {
			const data = readLocalStorage<Cloth>(clothMask.id)?.image
			if (!data) return
			const base64Image = await formatImage(data)
			setClothMaskImageScaled(base64Image)
		})()
	}, [clothMask])
	useEffect(() => {
		(async () => {
			const data = readLocalStorage<Openpose>(openpose.id)?.image
			if (!data) return
			const base64Image = await formatImage(data)
			setOpenposeImageScaled(base64Image)
		})()		
	}, [openpose])
	useEffect(() => {
		(async () => {
			const data = readLocalStorage<Generative>(generative.id)?.image
			if (!data) return
			const base64Image = await formatImage(data)
			setGenerativeImageScaled(base64Image)
		})()		
	}, [generative])

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

				<div className="align-middle max-w-screen-2xl bg-default-100 rounded-xl shadow-md items-center flex flex-col md:flex-row">
						<ImageContext.Provider 
							value={{
								openpose, setOpenpose,								
								humanParser, setHumanParser,
								clothMask, setClothMask,
								generative, setGenerative
							}}
						>
							<LoadingContext.Provider value={{ loading, setLoading }}>
								<SwipingContext.Provider value={{ swiping, setSwiping }}>
									<div className="max-w-sm text-center">
										<SwipingHuman />
										<p>{`Please select the model`}</p>
									</div>
									<div className="max-w-sm text-center">										
										<SwipingCloth />
										<p>{`Please select the cloth`}</p>
									</div>
									{
										(generative || openpose || humanParser || clothMask) && <div className="max-w-sm text-center">
											<Swiping
												alt="result"
												alts={['openpose', 'human-parser', 'cloth-parser']}
												imageSrc={generativeImageScaled || ''}
												imageSrcs={[
													openposeImageScaled || '',
													humanParserImageScaled || '',
													clothMaskImageScaled || '',
												]}
												loading={loading}
											/>
											<p>{`View the generative AI result`}</p>
										</div>
									}
								</SwipingContext.Provider>
							</LoadingContext.Provider>
						</ImageContext.Provider>
				</div>
			</div >
		</section>
	);
}