import React, { useState, MouseEvent } from "react";
import Head from "next/head";
import { Swiping, SwipingContext, SwipingContextState } from '@components/global/swiping'
import Image from "next/image";
import { Api } from "@services/api";

export default function Home() {
  const api = new Api()
  const [image, setImage] = useState<SwipingContextState>({ idx: 0, id: '00891_00' });
  const [cloth, setCloth] = useState<SwipingContextState>({ idx: 0, id: '01260_00' });

  const predictions = async () => {
    const result = await api.prediction(image.id, cloth.id)
    if (result.ok && !result.val.error && result.val.content) {
      console.log(result.val.content)
    } else {
      console.error(result.val)
    }
  }

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

      <div className="align-middle p-6 max-w-screen bg-white rounded-xl shadow-md flex items-center space-x-1">
        <div className="grid grid-cols-3 gap-4">
          <SwipingContext.Provider value={{ state: image, setState: setImage }}>
            <Swiping imageType='image' />
          </SwipingContext.Provider>

          <SwipingContext.Provider value={{ state: cloth, setState: setCloth }}>
            <Swiping imageType='cloth' />
          </SwipingContext.Provider>

          <div className="grid grid-cols-1 gap-4">
            <div className="items-center p-6">
              <button
                onClick={() => { predictions() }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-xl shadow-md space-x-1 inline-flex items-center">
                <Image
                  className=" p-2 w-1/3 h-auto"
                  src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEhklEQVR4nO2aX4hVVRTGf+OYpnYdgzI0skgyifKpiFSKGGMqCIOQlMKgh7AXy16KCgptnGkiLKJAepAigsAp7H9kBD0oSREZlhKmNY7FBDVZOhbYjQ3fgcXh/Fn7nHvvhPjBgcPea699vn333uvba184g9MPVwObgI+AEeAYcAr4EXgROB+YC7wE/KS6P4AfgLeA9aqfNKwA9gDNkuc7YH+JzQQwAEzvJIEpwPPAv/qI34CtwB3AQmA2MA1YAuwzH7tPZaGuAVyiNq8CJ2XzOXBup4hsVaf/ABuBcwps7zJE1hTYLRSJJvCJBqutWKnOwjq43mF/uSGyqMQ2DEjyC95DmxBG7CngqGN0LeYYIj0O+9tl+yvwHHAtLcIUTZ9kDofnYORPn7Tz9ncwtRF8AFxMDUwFtptdZVBTJRYxRBJcCmzQdp1sKL1UxLNy8gtwTVUnFYnYdbNN7Y8Dy4nEcm2vE6l5GrbOp7VWxvQefrlWEAl+hrQ+RhVXQn9dwBb5GNG6c2OXGj6ZKh/MCGYDLSISBiXte7PquoFPVfaCl8QSMy9npupGVbcUuLUgUmcR8T63AMv0HvpLcIXkzQmvpNkkJ0EnkUNkmSRKO4j0GiJHUr52qPx+D5GdMg57ehoDJVOriEgZsqZtf8rmXpUHsVmKIzJekFE3TR8+qsU+qPnbCiLJYh/TN/SrP1LTK/g64CEyIeMZHmPHR9fZftNoyNefOHAiQlKkUTT3W4GZJqaUIommV/0PiSySr0Me43dlvKpFnWcRsYHVBr8yrJWv4VJL4GEZvxYRfWOJDBYEvyIMyzYcj91niPGMo2dR9I0hYgNrVvDLwjwd5kJQnE+kRImNvl4iY8ZPElhDWREeld17ROChGtG36tQKZXnoVtYl2N0WI51H1OixCtHXQ2RqSiUMlKjohjkGvyNFXIpHTIMq0ddDxFOXxkVGddyNA1/KOPoQ02YiNvnxGQ4ck3FRmicNj6otaudFj+x/9xgfl3FIdXaKiLf9LL3/5fmoPbG7Q41RjyVymd7DDlaKB2T8RUTap5XTp6j9g3oPB6xSnA18qwZvOBPLnSAy3yiC1d7G4VB1WI32AneW/DqdIDJSNTccsnsfGkfhvuO6jLhi9VdWeiiPiFeANs3zuoJjJWyUk+8zOhrKWJRDTiJeAbo/JzUVjZfl6L6MOiv+enPEX7OmAN1QoDSi8JUcBYlQlB7KE5HNmgJ0Qc4AReOAHJ3nTA/1O6eWV4DONgnDWnhbjsIxsyg9lCciyxZ7mQDtU/vddYmsNj/tlRXa19l+L9Rlami/jproMqnKkCp6RtcMjTYQmaW7kRW61hg3avcsWoDpygWfSs3po45DjodIl7nWa6ae7bFXCR4sVlz52IzWDY6EWlnm8kbZnFTc2Kn1E/6M0HasUuff5OxodqGG56YcmwuMtlvJJCDonff1AT8Dj+t2q0ej32f0WpId7FPdHMmdJ0xQfdN7Fm8HGoq4RQFvh9nC855hLfRJx83AK9oqw9r5W6p5vVI53Xr/WnXjst2mHeoMTjv8B53HcCW4EiPaAAAAAElFTkSuQmCC"}
                  alt={'AI Generated'}
                  width={0}
                  height={0}
                  sizes="100vw"
                  quality={50}
                />
                <span>Generate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}