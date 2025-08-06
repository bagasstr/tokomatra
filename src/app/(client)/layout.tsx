import Navbar from '@/components/navbar'
import BottomNavbar from '@/components/bottomNavbar'
import { cn } from '@/lib/utils'
import Footer from '@/components/footer'

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={cn('overflow-y-auto h-dvh pb-16')} suppressHydrationWarning>
      <Navbar />
      <div className={cn('container pt-20 tablet:pt-24 desktop:pt-28')}>
        {children}
      </div>
      <BottomNavbar />
      <Footer />
    </div>
  )
}
