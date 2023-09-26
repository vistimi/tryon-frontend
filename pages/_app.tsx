import "@styles/globals.css";
import { AppProps } from "next/app";

interface CustomPageProps { }

function MyApp({ Component, pageProps }: AppProps<CustomPageProps>) {
  return <Component {...pageProps} />
}

export default MyApp;
