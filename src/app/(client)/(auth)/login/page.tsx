export const revalidate = 60

import LoginSection from '@/components/client/loginSection'
import { auth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const LoginPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) {
    redirect('/')
  }
  return (
    <div className={cn('')}>
      <LoginSection />
    </div>
  )
}
export default LoginPage
