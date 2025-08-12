import { Page } from '@/types/page.type'
import { AuthLayout } from '../AuthLayout'
import { ResetPasswordForm } from '../component/resetPasswordForm/ResetPassword.component'

const ResetPassword: Page = () => {
  return (
    <AuthLayout title="Reset Password">
      <ResetPasswordForm />
    </AuthLayout>
  )
}

ResetPassword.layoutProps = {
  title: 'Reset Password',
  header: false,
  sidebar: false,
  footer: false,
  pageType: 'public',
}

export default ResetPassword
