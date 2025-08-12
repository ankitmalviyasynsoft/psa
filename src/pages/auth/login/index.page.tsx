import { Page } from '@/types/page.type'
import { LoginForm } from '../component/loginForm/LoginForm.component'
import { AuthLayout } from '../AuthLayout'

const Login: Page = () => {
  return (
    <AuthLayout title="Login">
      <LoginForm />
    </AuthLayout>
  )
}

Login.layoutProps = {
  title: 'Login',
  header: false,
  sidebar: false,
  footer: false,
  pageType: 'auth',
}

export default Login
