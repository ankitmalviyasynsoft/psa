import { ReactElement, ReactNode } from 'react'
import { NextPage as NextPageType } from 'next'
import { AppProps as AppPropsType } from 'next/app'
import { LayoutProps } from '@/Layout/Layout.type'

export type NextPage<P = {}, IP = P> = NextPageType<P, IP> & {
  layoutProps: LayoutProps
  getNestedLayout?: (page: ReactElement) => ReactNode
}

export type AppProps = AppPropsType & {
  Component: NextPage
}
