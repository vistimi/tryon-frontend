import "@styles/globals.css";
import { AppProps } from "next/app";
import { scrollbar } from "@components/global/scrollbar";

interface CustomPageProps { }

function MyApp({ Component, pageProps }: AppProps<CustomPageProps>) {
  return <>
    <Component {...pageProps} />

    <style jsx global>
      {`
        ${scrollbar}
        body {
            margin: 0;
            font-family: Poppins;
            background: white;
            color: rgb(20, 20, 20);
            
            font-size: 14px; 
            font-style: normal; 
            font-variant: normal; 
            font-weight: 800;    
            overflow-x: hidden;           
        }
    `}
    </style>
  </>
}

export default MyApp;
