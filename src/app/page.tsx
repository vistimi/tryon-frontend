'use client'

import { useState } from "react";
import Head from "next/head"
import { LoadingContext, LoadingContextState, ResultContext, ResultContextState, Swiping, SwipingContext, SwipingContextState } from '@/components/swiping'
import Image from "next/image"
import { Api } from "@/services/api"

export default function Home() {
	const api = new Api()
	const [swiping, setSwiping] = useState<SwipingContextState>({ idxImage: 0, idxCloth: 0 })
	const [loading, setLoading] = useState<LoadingContextState>(false)
	const [result, setResult] = useState<ResultContextState>('')

	return (
		<section className="flex flex-col gap-6 py-8 md:py-10">
			<div className="flex mt-5 items-center">
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

				<div className="align-middle p-0 max-w-screen-2xl bg-white rounded-xl shadow-md items-center space-x-1 grid grid-flow-col-dense grid-cols-6">
						<ResultContext.Provider value={{ result, setResult }}>
							<LoadingContext.Provider value={{ loading, setLoading }}>
								<SwipingContext.Provider value={{ swiping, setSwiping }}>
									<div className="col-span-2">
									<Swiping imageType='image' api={api} />
									</div>

									<div className="col-span-2">
									<Swiping imageType='cloth' api={api} />
									</div>
								</SwipingContext.Provider>
							</LoadingContext.Provider>
						</ResultContext.Provider>

						<div className="col-span-2">
							<div className="p-2 grid grid-cols-1">
							<div className="p-2 items-center">
								{result != '' && <Image
								className="z-0 w-full h-auto row-span-full col-start-1 col-end-11 self-center object-cover rounded-xl shadow-md flex space-x-1"
								src={`data:image/png;base64,${result}`}
								alt={'AI Generated'}
								width={0}
								height={0}
								sizes="100vw"
								quality={75}
								priority={false}
								/>}
							</div>
							</div>
						</div>
				</div>
			</div >
		</section>
	);
}