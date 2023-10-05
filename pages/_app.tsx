import "@styles/globals.css";
import { AppProps } from "next/app";

interface CustomPageProps { }

export default function App({ Component, pageProps }: AppProps<CustomPageProps>) {
  return <Component {...pageProps} />
}
