import React from "react";
import Head from "next/head";
import Image from 'next/image'
import { Swiping } from '@components/global/swiping'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
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

      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-1">
        <div className="grid grid-cols-2 gap-4">
          <Swiping imageType='image' />
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-xl font-medium text-black">ChitChat</div>
              <p className="text-gray-500">You have a new message!</p>
            </div>

            <Swiping imageType='cloth' />

          </div>
        </div>
      </div>
    </div >
  );
}