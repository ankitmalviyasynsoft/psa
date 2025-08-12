export type LayoutProps = {
  header?: boolean
  footer?: boolean
  sidebar?: boolean
  title: string
  pageType?: 'public' | 'auth' | 'protected'
  roles?: 'customer' | 'admin' | 'superAdmin'
}
