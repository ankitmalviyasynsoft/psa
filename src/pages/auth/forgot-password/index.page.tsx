import { Page } from '@/types/page.type'
import { AuthLayout } from '../AuthLayout'
import { ForgotPasswordForm } from '../component/forgetPasswordForm/ForgotPassword.component'

const ForgotPassword: Page = () => {
  return (
    <AuthLayout title="Forgot Password">
      <ForgotPasswordForm />
    </AuthLayout>
  )
}

ForgotPassword.layoutProps = {
  title: 'Forgot Password',
  header: false,
  sidebar: false,
  footer: false,
  pageType: 'public',
}

export default ForgotPassword
