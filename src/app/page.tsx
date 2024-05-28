'use client'

import { useEffect, useState } from "react";
import { SwipingHuman } from "./swipingHuman";
import { SwipingContext, SwipingContextState } from "@/components/context/swiping";
import { LoadingContext, LoadingContextState } from "@/components/context/loading";
import { ImageContext, ImageContextClothParser, ImageContextGenerative, ImageContextHumanParser, ImageContextOpenpose } from "@/components/context/image";
import { SwipingCloth } from "./swipingCloth";
import { Swiping } from "@/components/swiping";
import { readLocalStorage } from "@/util/localstorage";

export default function Home() {
	const [swiping, setSwiping] = useState<SwipingContextState>({ idxHuman: 0, idxCloth: 0 })
	const [loading, setLoading] = useState<LoadingContextState>(false)

	const keyOpenpose = 'openpose'
	const keyHumanParser = 'human-parser'
	const keyClothParser = 'cloth-parser'
	const keyGenerative = 'generative'

	const [openpose, setOpenpose] = useState<ImageContextOpenpose>(null)
	const [humanParser, setHumanParser] = useState<ImageContextHumanParser>(null)
	const [clothParser, setClothParser] = useState<ImageContextClothParser>(null)
	const [generative, setGenerative] = useState<ImageContextGenerative>(null)

	type Openpose = {image: number[], format: string, label:any}
	type Human = {image: number[], format: string}
	type Cloth = {image: number[], format: string}
	type Generative = {image: number[], format: string}

	const [humanParserScaled, setHumanParserScaled] = useState<null|string>(null)
	useEffect(() => {
		if (humanParser?.id) {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			if (!ctx || !canvas) return
			const image = new Image()
			const data = readLocalStorage<Human>(humanParser.id)?.image
			if (!data) return
			image.src = `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(data)))}`
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
				// setHumanParserScaled(Array.from(new Uint8Array(data.data)))
				const base64Image = canvas.toDataURL("image/png");
				setHumanParserScaled(base64Image)
				// console.info('base64Image', base64Image.split(",")[1])
			}
		}
	}, [humanParser])

	const [clothParserScaled, setClothParserScaled] = useState<null|string>(null)
	useEffect(() => {
		if (clothParser?.id) {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			if (!ctx || !canvas) return
			const image = new Image()
			const data = readLocalStorage<Cloth>(clothParser.id)?.image
			if (!data) return
			image.src = `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(data)))}`
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
				// setClothParserScaled(Array.from(new Uint8Array(data.data)))
				const base64Image = canvas.toDataURL("image/png");
				setClothParserScaled(base64Image)
				// console.info('base64Image', base64Image.split(",")[1])
			}
		}
	}, [clothParser])

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
								clothParser, setClothParser,
								generative, setGenerative
							}}
						>
							<LoadingContext.Provider value={{ loading, setLoading }}>
								<SwipingContext.Provider value={{ swiping, setSwiping }}>
									<div className="max-w-sm text-center">
										<SwipingHuman />
										<text>{`Please select the model`}</text>
									</div>
									<div className="max-w-sm text-center">										
										<SwipingCloth />
										<text>{`Please select the cloth`}</text>
									</div>
									{
										(generative || openpose || humanParser || clothParser) && <div className="max-w-sm text-center">
											<Swiping
												alt="result"
												alts={['openpose', 'human-parser', 'cloth-parser']}
												imageSrc={generative ? `data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(readLocalStorage<Generative>(generative.id)?.image || [])))}` : ''}
												imageSrcs={[
													openpose?.id ? `data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(readLocalStorage<Openpose>(openpose.id)?.image || [])))}` : '',
													humanParserScaled ? humanParserScaled : '',
													clothParserScaled ? clothParserScaled : '',
												]}
												loading={loading}
											/>
											<text>{`View the generative AI result`}</text>
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