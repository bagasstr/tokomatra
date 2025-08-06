import VerificationSection from '@/components/client/verificationSection'
import { auth } from '@/lib/auth'
import { authClient, isEmailVerified } from '@/lib/authClient'
import { cn } from '@/lib/utils'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const VerificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (session?.user?.emailVerified) {
    redirect('/')
  }
  return <VerificationSection />
}
export default VerificationPage
