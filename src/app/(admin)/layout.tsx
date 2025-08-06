import { auth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { headers } from 'next/headers'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/appSidebar'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Dapatkan sesi pengguna
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Periksa apakah pengguna adalah super admin atau admin
  if (session?.user.role !== 'SUPER_ADMIN' && session?.user.role !== 'ADMIN') {
    redirect('/login-admin')
  }

  // Render layout admin jika terotorisasi
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className='container-desktop'>
        <header className={cn('py-4 flex items-center justify-between')}>
          <SidebarTrigger />
          {/* <UserNav session={session} /> */}
        </header>
        {children}
      </main>
    </SidebarProvider>
  )
}
