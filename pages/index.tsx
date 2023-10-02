import React, { useState, MouseEvent } from "react";
import Head from "next/head";
import { Swiping, SwipingContext, SwipingContextState } from '@components/global/swiping'
import Image from "next/image";
import { Api } from "@services/api";

export default function Home() {
  const api = new Api()
  const [image, setImage] = useState<SwipingContextState>({ idx: 0, id: '00891_00' })
  const [cloth, setCloth] = useState<SwipingContextState>({ idx: 0, id: '01260_00' })
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const prediction = async () => {
    setLoading(true)
    const result = await api.prediction(image.id, cloth.id)
    if (result.ok) {
      const base64String = btoa(String.fromCharCode(...new Uint8Array(result.val)));
      setResult(base64String)
    } else {
      console.error(result.val)
    }
    setLoading(false)
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

      <div className="align-middle p-2 max-w-screen bg-white rounded-xl shadow-md flex items-center space-x-1">
        <div className="grid grid-flow-col-dense grid-cols-7">
          <div className="col-span-2">
            <SwipingContext.Provider value={{ state: image, setState: setImage }}>
              <Swiping imageType='image' />
            </SwipingContext.Provider>
          </div>

          <div className="col-span-2">
            <SwipingContext.Provider value={{ state: cloth, setState: setCloth }}>
              <Swiping imageType='cloth' />
            </SwipingContext.Provider>
          </div>


          <div className="col-span-1">
            <div className="grid grid-cols-1 items-center">
              <div className="">
                {loading ?
                  <div role="status">
                    <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div> :
                  <button
                    onClick={() => { prediction() }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-xl shadow-md space-x-1 inline-flex items-center">
                    <Image
                      className=" p-2 w-1/3 h-auto"
                      src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEhklEQVR4nO2aX4hVVRTGf+OYpnYdgzI0skgyifKpiFSKGGMqCIOQlMKgh7AXy16KCgptnGkiLKJAepAigsAp7H9kBD0oSREZlhKmNY7FBDVZOhbYjQ3fgcXh/Fn7nHvvhPjBgcPea699vn333uvba184g9MPVwObgI+AEeAYcAr4EXgROB+YC7wE/KS6P4AfgLeA9aqfNKwA9gDNkuc7YH+JzQQwAEzvJIEpwPPAv/qI34CtwB3AQmA2MA1YAuwzH7tPZaGuAVyiNq8CJ2XzOXBup4hsVaf/ABuBcwps7zJE1hTYLRSJJvCJBqutWKnOwjq43mF/uSGyqMQ2DEjyC95DmxBG7CngqGN0LeYYIj0O+9tl+yvwHHAtLcIUTZ9kDofnYORPn7Tz9ncwtRF8AFxMDUwFtptdZVBTJRYxRBJcCmzQdp1sKL1UxLNy8gtwTVUnFYnYdbNN7Y8Dy4nEcm2vE6l5GrbOp7VWxvQefrlWEAl+hrQ+RhVXQn9dwBb5GNG6c2OXGj6ZKh/MCGYDLSISBiXte7PquoFPVfaCl8QSMy9npupGVbcUuLUgUmcR8T63AMv0HvpLcIXkzQmvpNkkJ0EnkUNkmSRKO4j0GiJHUr52qPx+D5GdMg57ehoDJVOriEgZsqZtf8rmXpUHsVmKIzJekFE3TR8+qsU+qPnbCiLJYh/TN/SrP1LTK/g64CEyIeMZHmPHR9fZftNoyNefOHAiQlKkUTT3W4GZJqaUIommV/0PiSySr0Me43dlvKpFnWcRsYHVBr8yrJWv4VJL4GEZvxYRfWOJDBYEvyIMyzYcj91niPGMo2dR9I0hYgNrVvDLwjwd5kJQnE+kRImNvl4iY8ZPElhDWREeld17ROChGtG36tQKZXnoVtYl2N0WI51H1OixCtHXQ2RqSiUMlKjohjkGvyNFXIpHTIMq0ddDxFOXxkVGddyNA1/KOPoQ02YiNvnxGQ4ck3FRmicNj6otaudFj+x/9xgfl3FIdXaKiLf9LL3/5fmoPbG7Q41RjyVymd7DDlaKB2T8RUTap5XTp6j9g3oPB6xSnA18qwZvOBPLnSAy3yiC1d7G4VB1WI32AneW/DqdIDJSNTccsnsfGkfhvuO6jLhi9VdWeiiPiFeANs3zuoJjJWyUk+8zOhrKWJRDTiJeAbo/JzUVjZfl6L6MOiv+enPEX7OmAN1QoDSi8JUcBYlQlB7KE5HNmgJ0Qc4AReOAHJ3nTA/1O6eWV4DONgnDWnhbjsIxsyg9lCciyxZ7mQDtU/vddYmsNj/tlRXa19l+L9Rlami/jproMqnKkCp6RtcMjTYQmaW7kRW61hg3avcsWoDpygWfSs3po45DjodIl7nWa6ae7bFXCR4sVlz52IzWDY6EWlnm8kbZnFTc2Kn1E/6M0HasUuff5OxodqGG56YcmwuMtlvJJCDonff1AT8Dj+t2q0ej32f0WpId7FPdHMmdJ0xQfdN7Fm8HGoq4RQFvh9nC855hLfRJx83AK9oqw9r5W6p5vVI53Xr/WnXjst2mHeoMTjv8B53HcCW4EiPaAAAAAElFTkSuQmCC"}
                      alt={'AI Generate'}
                      width={0}
                      height={0}
                      sizes="100vw"
                      quality={50}
                    />
                    <span>Generate</span>
                  </button>
                }
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="grid grid-cols-1">
              <div className="items-center p-2">
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