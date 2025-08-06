'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {
  BarChart,
  BarChart3,
  Box,
  ChevronDown,
  Home,
  LayoutDashboard,
  Package,
  ShoppingCart,
  User,
  UserCog,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useSession } from '@/lib/authClient'

export function AppSidebar() {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    products: false,
    users: false,
    settings: false,
  })

  const { data: user } = useSession()

  // Update openGroups berdasarkan pathname
  useEffect(() => {
    setOpenGroups({
      products: pathname.includes('/dashboard/produk'),
      users:
        pathname.includes('/dashboard/admin') ||
        pathname.includes('/dashboard/pelanggan'),
      settings: false,
    })
  }, [pathname])

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  return (
    <div className=''>
      <Sidebar variant='floating'>
        <SidebarHeader>
          <div className='flex items-center gap-2 px-4 py-2'>
            <Image src={'/Logo.png'} alt='logo' width={35} height={35} />
            <span className='font-bold text-xl'>Toko Matra</span>
          </div>
        </SidebarHeader>
        <SidebarContent className={cn('space-y-4 mt-4')}>
          <SidebarGroupContent>
            <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem className='mx-2'>
                <SidebarMenuButton
                  asChild
                  className='hover:bg-primary/20 hover:text-primary'
                  isActive={pathname === '/dashboard'}>
                  <Link href='/dashboard'>
                    <Home className='h-4 w-4' />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Pesanan */}
              <SidebarMenuItem className='mx-2'>
                <SidebarMenuButton
                  variant={'default'}
                  asChild
                  className='hover:bg-primary/20 hover:text-primary'
                  isActive={pathname === '/dashboard/pesanan'}>
                  <Link
                    href='/dashboard/pesanan'
                    className={cn(
                      'flex justify-between items-center gap-2 w-full'
                    )}>
                    <div className='flex items-center gap-2'>
                      <ShoppingCart className='h-4 w-4' />
                      <span>Pesanan</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Produk Group */}
              <SidebarMenuItem className='mx-2'>
                <SidebarMenuButton
                  variant={'default'}
                  className='hover:bg-primary/20 hover:text-primary'
                  onClick={() => toggleGroup('products')}>
                  <Package className='h-4 w-4' />
                  <span>Produk</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 ml-auto transition-transform',
                      openGroups.products ? 'rotate-180' : ''
                    )}
                  />
                </SidebarMenuButton>
                {openGroups.products && (
                  <div className='pl-8 mt-2 space-y-2'>
                    <SidebarMenuButton
                      variant={'default'}
                      isActive={pathname === '/dashboard/produk'}
                      className='hover:bg-primary/20 hover:text-primary'
                      asChild>
                      <Link
                        href='/dashboard/produk'
                        className='block text-sm hover:text-primary'>
                        Daftar Produk
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      variant={'default'}
                      isActive={pathname === '/dashboard/produk/kategori'}
                      className='hover:bg-primary/20 hover:text-primary'
                      asChild>
                      <Link
                        href='/dashboard/produk/kategori'
                        className='block text-sm hover:text-primary'>
                        Kategori
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      variant={'default'}
                      isActive={pathname === '/dashboard/produk/merek'}
                      className='hover:bg-primary/20 hover:text-primary'
                      asChild>
                      <Link
                        href='/dashboard/produk/merek'
                        className='block text-sm hover:text-primary'>
                        Merek
                      </Link>
                    </SidebarMenuButton>
                  </div>
                )}
              </SidebarMenuItem>

              {/* Pelanggan */}

              {/* Statistik */}
              <SidebarMenuItem className='mx-2'>
                <SidebarMenuButton
                  variant={'default'}
                  asChild
                  className='hover:bg-primary/20 hover:text-primary'
                  isActive={pathname === '/dashboard/statistik'}>
                  <Link href='/dashboard/statistik'>
                    <BarChart3 className='h-4 w-4' />
                    <span>Statistik</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Pengguna Group */}
              <SidebarMenuItem className='mx-2'>
                <SidebarMenuButton
                  variant={'default'}
                  className='hover:bg-primary/20 hover:text-primary'
                  onClick={() => toggleGroup('users')}>
                  <Users className='h-4 w-4' />
                  <span>Pengguna</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 ml-auto transition-transform',
                      openGroups.users ? 'rotate-180' : ''
                    )}
                  />
                </SidebarMenuButton>
                {openGroups.users && (
                  <div className='pl-8 mt-2 space-y-2'>
                    {user?.user?.role === 'SUPER_ADMIN' && (
                      <SidebarMenuButton
                        variant={'default'}
                        asChild
                        className='hover:bg-primary/20 hover:text-primary'
                        isActive={pathname === '/dashboard/admin'}>
                        <Link
                          href='/dashboard/admin'
                          className='block text-sm hover:text-primary'>
                          <UserCog className='h-4 w-4' />
                          <span>Admin</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                    <SidebarMenuButton
                      variant={'default'}
                      asChild
                      className='hover:bg-primary/20 hover:text-primary'
                      isActive={pathname === '/dashboard/pelanggan'}>
                      <Link href='/dashboard/pelanggan'>
                        <User className='h-4 w-4' />
                        <span>Pelanggan</span>
                      </Link>
                    </SidebarMenuButton>
                  </div>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarContent>
      </Sidebar>
    </div>
  )
}
