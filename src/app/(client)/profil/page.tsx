'use client'

import { authClient } from '@/lib/authClient'
import { cn } from '@/lib/utils'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Profile } from '@/lib/type'
import { queryClient } from '@/lib/queryClient'
import ProfileLoading from '@/app/(client)/profil/profileLoading'
import { deleteNotification } from '@/app/actions/notification'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Building,
  Calendar,
  Check,
  Edit2,
  Landmark,
  LogOut,
  Phone,
  Plus,
  User,
  UserIcon,
  VenusAndMars,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const ProfilPage = () => {
  const router = useRouter()

  const params = useSearchParams()
  const pathname = params.get('user')
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch(`/api/profile`)
      return await response.json()
    },
  })
  if (isLoading) return <ProfileLoading />
  return (
    <div>
      <div className={cn('')}>
        <div className={cn('')}>
          <div className={cn('flex items-center gap-4 mb-8')}>
            <Avatar className='h-16 w-16 border-2 border-white shadow-md'>
              <AvatarImage src={profile?.data?.imageUrl || '/profile.png'} />
              <AvatarFallback>
                <UserIcon className='w-4 h-4' />
              </AvatarFallback>
            </Avatar>
            <div className={cn('')}>
              <h1 className={cn('')}>{profile?.data?.fullName}</h1>
              <p className={cn('')}>{profile?.data?.email}</p>
            </div>
          </div>
          <div className={cn('flex items-center gap-2')}>
            <Link
              onClick={() => {
                queryClient.invalidateQueries({
                  queryKey: ['profile', pathname?.toString()],
                })
              }}
              href={{
                pathname: '/profil/edit',
                query: { user: profile?.data?.users?.id },
              }}
              className={cn('gap-2')}>
              <Button>
                <Edit2 className='h-4 w-4' />
                Edit Profil
              </Button>
            </Link>

            <Button
              variant='ghost'
              size='sm'
              onClick={async () => {
                await deleteNotification(profile?.data?.email as string)
                await queryClient.invalidateQueries({
                  queryKey: ['notificationCount'],
                })
                await queryClient.invalidateQueries({
                  queryKey: ['notification'],
                })
                await authClient.signOut()
                router.push('/login')
              }}
              className='gap-2 text-red-600 hover:text-red-700 hover:bg-red-50'>
              <LogOut className='h-4 w-4' />
              Keluar
            </Button>
          </div>
          <div className='mt-10 space-y-3'>
            <Card>
              <CardHeader>
                <CardTitle>
                  <h2>Informasi Akun</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <User className='w-4 h-4' />
                  <h4 className='text-foreground/80'>
                    {profile?.data?.userName || '-'}
                  </h4>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='w-4 h-4' />
                  <h4 className='text-foreground/80'>
                    {profile?.data?.phoneNumber || '-'}
                  </h4>
                </div>
                <div className='flex items-center gap-2'>
                  <div className=''>
                    <VenusAndMars className='w-4 h-4' />
                  </div>
                  <h4 className='text-foreground/80'>
                    {profile?.data?.gender || '-'}
                  </h4>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  <h4 className='text-foreground/80'>
                    {profile?.data?.dateOfBirth || '-'}
                  </h4>
                </div>
                <Separator className='my-4' />
                <div className='flex items-start gap-2'>
                  <div className=''>
                    <h3 className='text-foreground/80'>Bio</h3>
                    <p className='text-foreground/80'>
                      {profile?.data?.bio || '-'}
                    </p>
                  </div>
                </div>
                <Separator className='my-4' />
                <div className='space-y-2'>
                  <h3 className='text-foreground/80'>Informasi Bisnis</h3>
                  <div className={cn('flex items-center gap-2')}>
                    <Building className='w-4 h-4' />
                    <h4 className='text-foreground/80'>
                      {profile?.data?.companyName || '-'}
                    </h4>
                  </div>
                  <div className={cn('flex items-center gap-2')}>
                    <Landmark className='w-4 h-4' />
                    <h4 className='text-foreground/80'>
                      {profile?.data?.taxId || '-'}
                    </h4>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <h2>Riwayat</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className='grid grid-cols-2 gap-4'>
                <Link
                  href='/wishlist'
                  className={cn(
                    'flex flex-col items-center bg-blue-50 p-4 rounded-lg'
                  )}>
                  <h2 className='text-blue-600'>10</h2>
                  <h4 className='text-blue-600'>Wishlist</h4>
                </Link>
                <Link
                  href='/pesanan'
                  className={cn(
                    'flex flex-col items-center bg-green-50 p-4 rounded-lg'
                  )}>
                  <h2 className='text-green-600'>10</h2>
                  <h4 className='text-green-600'>Pesanan</h4>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  <h2>Alamat</h2>
                </CardTitle>
                <CardAction>
                  <Button variant='ghost' size='sm' className='text-primary'>
                    <Plus className='w-4 h-4' />
                    Tambah
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className='grid grid-cols-2 gap-4'></CardContent>
              <CardFooter className='flex justify-end'>
                <Button
                  variant='default'
                  size='sm'
                  className='text-primary-foreground'>
                  <Check className='w-4 h-4' />
                  Pilih Alamat
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProfilPage
