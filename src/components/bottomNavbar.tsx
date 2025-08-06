'use client'

import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import {
  Heart,
  Home,
  Menu,
  MenuSquare,
  UserCircle,
  UserCircle2,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSession } from '@/lib/authClient'

const BottomNavbar = () => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isActive = (path: string) => pathname === path
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-background container tablet:hidden py-4'
      )}>
      <div className='flex items-center justify-around'>
        <Link
          href='/'
          className={cn(
            'flex flex-col justify-center gap-x-2',
            isActive('/') && 'text-primary'
          )}>
          <Button variant={'ghost'} size={'icon'} className='flex-col'>
            <Home className='size-4' />
            <p>Beranda</p>
          </Button>
        </Link>
        <Link
          href='/kategori'
          className={cn(
            'flex flex-col justify-center gap-x-2',
            isActive('/kategori') && 'text-primary'
          )}>
          <Button variant={'ghost'} size={'icon'} className='flex-col'>
            <MenuSquare className='size-4' />
            <p>Kategori</p>
          </Button>
        </Link>
        <Link
          href='/wishlist'
          className={cn(
            'flex flex-col justify-center gap-x-2',
            isActive('/wishlist') && 'text-primary'
          )}>
          <Button variant={'ghost'} size={'icon'} className='flex-col'>
            <Heart className='size-4' />
            <p>Wishlist</p>
          </Button>
        </Link>
        <Link
          href={{
            pathname: '/profil',
            query: { id: session?.user?.id },
          }}
          className={cn(
            'flex flex-col justify-center gap-x-2',
            isActive('/profil') && 'text-primary'
          )}>
          <Button variant={'ghost'} size={'icon'} className='flex-col'>
            <UserCircle2 className='size-4' />
            <p>Profil</p>
          </Button>
        </Link>
      </div>
    </div>
  )
}
export default BottomNavbar
