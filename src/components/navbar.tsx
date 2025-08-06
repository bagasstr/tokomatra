'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Bell, Menu, ShoppingCart, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSession } from '@/lib/authClient'
import { useQuery } from '@tanstack/react-query'
import {
  getNotification,
  getNotificationCount,
} from '@/app/actions/notification'

interface Users {
  users: {
    profile: {
      fullName: string | null
      userName: string | null
    } | null
  }
}

const Navbar = () => {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path
  const { data: session } = useSession()
  const { data: notificationCount } = useQuery<number>({
    queryKey: ['notificationCount'],
    queryFn: async () => await getNotificationCount(session?.user.email || ''),
    enabled: !!session,
  })
  return (
    <div
      className={cn(
        'py-4 fixed top-0 left-0 right-0 z-50 bg-background container'
      )}>
      <div className='flex items-center justify-between'>
        {/* Logo */}
        <div className='flex items-center gap-x-2 tablet:mr-4'>
          <div className='relative h-10 w-10'>
            <Image src='/logo.png' alt='logo' fill className='object-contain' />
          </div>
          <h2 className={cn('text-primary hidden tablet:block')}>Toko Matra</h2>
        </div>

        {/* Menu */}
        <div className='items-center hidden tablet:flex gap-x-4 mx-2 tablet:mx-4'>
          <Link
            href='/'
            className={cn('font-medium', isActive('/') && 'text-primary')}>
            Beranda
          </Link>
          <Link
            href='/kategori'
            className={cn(
              'font-medium',
              isActive('/kategori') && 'text-primary'
            )}>
            Kategori
          </Link>
        </div>

        {/* Search Bar */}
        <div className='flex items-center gap-2 w-full flex-1 ml-3 tablet:mx-4'>
          <Input type='text' placeholder='Cari produk...' className='w-full' />
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2 flex-shrink-0 ml-2 tablet:ml-4'>
          <Link href='/notifikasi'>
            <Button variant={'ghost'} size={'icon'} className='relative'>
              <Bell className='size-4 desktop:size-5' />
              {notificationCount !== undefined && notificationCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center'>
                  {notificationCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href='/keranjang'>
            <Button variant={'ghost'} size={'icon'}>
              <ShoppingCart className='size-4 desktop:size-5' />
            </Button>
          </Link>
          {session ? (
            <Link
              className='hidden tablet:block'
              href={{
                pathname: '/profil',
                query: {
                  id: session.user.id,
                },
              }}>
              <Button variant={'ghost'} size={'icon'}>
                <User className='size-4 desktop:size-5' />
              </Button>
            </Link>
          ) : (
            <Link href='/login' className='hidden tablet:block'>
              <Button variant={'ghost'} size={'icon'}>
                <User className='size-4 desktop:size-5' />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
export default Navbar
