import { Provider } from 'react-redux'
import { store } from '../app/store'
import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MyApp = ({ Component, pageProps: { session, ...pageProps }}) => {
  return (
    <SessionProvider session ={session} refetchInterval={5 * 60}>
    <Provider store={store}>
      <Header/>
      <Component {...pageProps} />
      <Footer/>
    </Provider>
   </SessionProvider>
  )
}

export default MyApp
