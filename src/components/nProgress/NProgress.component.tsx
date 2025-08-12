import Router from 'next/router'
import nProgress from 'nprogress'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material'
import 'nprogress/nprogress.css'

nProgress.configure({ showSpinner: false })

export default function NProgress() {
  const router = useRouter()
  const theme = useTheme()
  const ignoreRoutes: string[] = []

  useEffect(() => {
    const handleStart = () => {
      nProgress.start()
    }
    const handleComplete = () => {
      nProgress.done()
    }

    Router.ready(() => {
      router.events.on('routeChangeStart', (path, { shallow }) => !shallow && !ignoreRoutes.includes(path) && handleStart())
      router.events.on('routeChangeComplete', handleComplete)
      router.events.on('routeChangeError', handleComplete)
    })

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router.events])

  return (
    <style jsx global>{`
      #nprogress {
        z-index: ${theme.zIndex.tooltip + 1};
        position: relative;
      }

      #nprogress .bar {
        z-index: ${theme.zIndex.tooltip + 1};
        background: ${theme.palette.secondary.main};
        height: 3px;
      }

      #nprogress .peg {
        box-shadow:
          0 0 10px ${theme.palette.secondary.main},
          0 0 5px ${theme.palette.secondary.main};
      }
    `}</style>
  )
}
