import type { AppProps } from 'next/app'
import '../global.css'
import '../ubuntu-font.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
      <Component {...pageProps} />
  )
}