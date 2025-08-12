import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const useUnsavedChangesWarning = (isDirty: boolean) => {
  const router = useRouter()

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!isDirty) return
      e.preventDefault()
      e.returnValue = ''
    }

    const handleBrowseAway = (url: string) => {
      if (!isDirty) return
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return
      }
      router.events.emit('routeChangeError')
      throw 'routeChange aborted.'
    }

    window.addEventListener('beforeunload', handleWindowClose)
    router.events.on('routeChangeStart', handleBrowseAway)

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      router.events.off('routeChangeStart', handleBrowseAway)
    }
  }, [isDirty, router])
}
