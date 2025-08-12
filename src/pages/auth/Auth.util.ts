import { setCookie } from '@/utils/cookie.util'

export const setUser = (profile: any) => {
  setCookie('token', profile.token, 30)

  // window.location.href = '/'
}
