import '../styles/globals.css';
import Nav from '../components/Nav';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Nav />
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
