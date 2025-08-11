'use client'

import Header from '@/components/ui/header'
import { cn } from '@/lib/utils'
import { useSession } from '@/lib/authClient'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Landmark,
  Building,
  Phone,
  User,
  Shield,
  UserIcon,
  VenusAndMars,
  RefreshCcw,
  Edit2,
  IdCard,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { IProfile } from '@/lib/type'
import ProfileLoading from '@/app/(client)/profil/profileLoading'
import Link from 'next/link'

const ProfileAdmin = () => {
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery<IProfile>({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await fetch('/api/profile-admin')
      if (!res.ok) throw new Error('Gagal memuat profil')
      return await res.json()
    },
  })

  if (isLoading) return <ProfileLoading />
  console.log(profile)

  return (
    <div className={cn('')}>
      <Header>
        <h2 className={cn('text-secondary-foreground/80')}>Profil Admin</h2>
        {profile?.data?.profile?.userName !== 'Admin Toko Matra' && (
          <Link
            href={{
              pathname: '/dashboard/profile-admin/edit',
              query: {
                id: profile?.data?.profile?.id_profile,
              },
            }}
            className='gap-2'>
            <Button size='lg' variant={'outline'} className='gap-2'>
              <Edit2 className='h-4 w-4' />
              Edit Profil
            </Button>
          </Link>
        )}
      </Header>

      <div className='flex items-center gap-4 mb-6'>
        <Avatar className='h-16 w-16 border-2 border-white shadow-md'>
          <AvatarImage
            src={profile?.data?.profile?.imageUrl || '/profile.png'}
          />
          <AvatarFallback>
            <UserIcon className='w-4 h-4' />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className='text-xl font-semibold'>
            {profile?.data?.profile?.fullName || '-'}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {profile?.data?.profile?.email || '-'}
          </p>
          <div className='mt-1 flex items-center gap-2 text-xs text-primary'>
            <Shield className='h-3.5 w-3.5' />
            <p>
              {profile?.data?.profile?.userName === 'Admin Toko Matra'
                ? 'SUPER ADMIN'
                : profile?.data?.profile?.userName !== 'Admin'
                ? 'ADMIN'
                : '-'}
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>
              <h3>Informasi Akun</h3>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center gap-2'>
              <User className='w-4 h-4' />
              <h5 className='text-foreground/80'>
                {profile?.data?.profile?.userName || '-'}
              </h5>
            </div>
            <div className='flex items-center gap-2'>
              <IdCard className='w-4 h-4' />
              <h5 className='text-foreground/80'>
                {profile?.data?.profile?.taxId || '-'}
              </h5>
            </div>
            <Separator className='my-2' />
            <div className='text-foreground/80 space-y-1'>
              <p>Dibuat: {formatDate(profile?.data?.profile?.createdAt)}</p>
              <p>Diperbarui: {formatDate(profile?.data?.profile?.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <h3>Informasi Bisnis</h3>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center gap-2'>
              <Building className='w-4 h-4' />
              <h5 className='text-foreground/80'>
                {profile?.data?.profile?.companyName || 'Matra Kosala Digdaya'}
              </h5>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default ProfileAdmin

function formatDate(value?: Date | string) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
