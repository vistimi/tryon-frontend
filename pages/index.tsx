import React, { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head"
import { LoadingContext, LoadingContextState, ResultContext, ResultContextState, Swiping, SwipingContext, SwipingContextState } from '@components/global/swiping'
import Image from "next/image"
import { Api } from "@services/api"
import Link from "next/link"

export default function Index() {
  const api = new Api()
  const [swiping, setSwiping] = useState<SwipingContextState>({ idxImage: 0, idxCloth: 0 })
  const [loading, setLoading] = useState<LoadingContextState>(false)
  const [result, setResult] = useState<ResultContextState>('')

  return (
    <div className="">
      <Head>
        <title>Try-on</title>
        <meta name="description" content="Checkout our try-on" key="desc" />
        <meta property="og:title" content="Try-on" />
        <meta
          property="og:description"
          content="Try-on clothes fashion shopping with swiping mechanism"
        />
        {/* <meta property="og:image" content="https://example.com/images/cool-page.jpg" /> */}
      </Head>

      {/* <Link href="/info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </Link> */}


      {/* TODO: max-w-screen is too much */}
      <div className="align-middle p-0 max-w-screen-2xl bg-white rounded-xl shadow-md flex items-center space-x-1">
        <div className="grid grid-flow-col-dense grid-cols-6">

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
      </div>
    </div >
  );
}