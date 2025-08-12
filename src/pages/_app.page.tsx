import * as React from 'react'
import Head from 'next/head'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastContainer } from 'react-toastify'

import theme from '@/styles/mui-theme-config'
import Layout from '@/Layout/Layout.component'
import NProgress from '@/components/nProgress/NProgress.component'
import { ThemeProvider } from '@mui/material/styles'
import { AppProps } from './_app.type'
import { Provider } from 'react-redux'
import { store } from '@/redux/store/store'

function App({ Component, pageProps }: AppProps) {
  const layoutProps = Component.layoutProps

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ToastContainer position="top-right" />
          <NProgress />
          <CssBaseline />
          <Layout {...layoutProps}>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default App
