import { cn } from '@/lib/utils'
import NotificationSection from '@/components/client/notificationSection'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { authClient } from '@/lib/authClient'
import { getNotification } from '@/app/actions/notification'

const NotifikasiPage = async () => {
  return (
    <div className={cn('')}>
      <NotificationSection />
    </div>
  )
}
export default NotifikasiPage
