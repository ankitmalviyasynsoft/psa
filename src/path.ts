export const paths = {
  home: '/',
  auth: { signIn: '/auth/login', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password', forgotPassword: '/auth/forgot-password' },
  adminPaths: ['/admin/settings', '/admin/psa-submissions', '/admin/psa-customer-submissions', '/admin/psa-unpaid-customer-submissions', '/admin/awaiting-submissions', '/admin/cards-on-sell', '/admin/cards-bought'],
  customerPaths: ['/customer/dashboard', '/customer/my-profile', '/customer/submissionNumber', '/success', '/cancel', '/customer/purchased-cards', '/customer/my-graded-cards'],
  superAdminPaths: ['/super-admin/customer-list', '/super-admin/store-list', '/super-admin/unapproved-retailer', '/super-admin/upload-cards', '/super-admin/card-list', '/super-admin/dashboard', '/super-admin/export-csv'],
  dashboard: {},
  errors: {},
} as const
