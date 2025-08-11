'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LogOut, Settings, User } from 'lucide-react'
import { signOut, useSession } from '@/lib/authClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const UserNav = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const handleLogout = async () => {
    await signOut()
    router.replace('/login-admin')
    router.refresh()
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/placeholder-user.jpg' alt='Avatar' />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {session?.user.name}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {session?.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href='/dashboard/profile-admin'>
            <DropdownMenuItem>
              <User className='mr-2 h-4 w-4' />
              <span>Profil</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <Settings className='mr-2 h-4 w-4' />
            <span>Pengaturan</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Button
          variant={'destructive'}
          className={cn('text-background w-full')}
          onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4 text-background' />
          <span>Keluar</span>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default UserNav
