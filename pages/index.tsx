import React, { useContext, useReducer, useState } from "react";
import Head from "next/head";
import { Swiping, SwipingContext, SwipingContextState } from '@components/global/swiping'

export default function Home() {

  // const { state: image, setState: setImage } = useContext(SwipingContext);
  // const { state: cloth, setState: setCloth } = useContext(SwipingContext);

  const [image, setImage] = useState<SwipingContextState>({ idx: 0, id: '00891_00' });
  const [cloth, setCloth] = useState<SwipingContextState>({ idx: 0, id: '01260_00' });

  return (
    <div className="p-24">
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

      <div className="align-middle p-6 max-w-screen-lg bg-white rounded-xl shadow-md flex items-center space-x-1">
        <div className="grid grid-cols-2 gap-4">
          <SwipingContext.Provider value={{ state: image, setState: setImage }}>
            <Swiping imageType='image' />
          </SwipingContext.Provider>

          <div className="grid grid-cols-1 gap-4">
            {/* <div>
                <div className="text-xl font-medium text-black">ChitChat</div>
                <p className="text-gray-500">You have a new message!</p>
              </div> */}

            <SwipingContext.Provider value={{ state: cloth, setState: setCloth }}>
              <Swiping imageType='cloth' />
            </SwipingContext.Provider>

          </div>
        </div>
      </div>
    </div >
  );
}