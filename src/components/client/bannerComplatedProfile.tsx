'use client'

import { Profile } from '@/lib/type'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useSession } from '@/lib/authClient'

const BannerComplatedProfile = () => {
  const { data: session } = useSession()
  const { data: profile } = useQuery<Profile>({
    queryKey: ['banner-profile'],
    queryFn: async () => {
      const response = await fetch(`/api/profile`)
      return await response.json()
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    enabled: !!session,
  })
  return (
    <>
      {(!profile?.data?.fullName ||
        !profile?.data?.phoneNumber ||
        !profile?.data?.gender ||
        !profile?.data?.dateOfBirth) && (
        <div className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded'>
          <p className='font-semibold'>
            Mohon lengkapi data{' '}
            <Link
              className='underline'
              href={{
                pathname: '/profil',
                query: { id: profile?.data?.id_profile },
              }}>
              profil
            </Link>{' '}
            sebelum melakukan pemesanan.
          </p>
        </div>
      )}
    </>
  )
}
export default BannerComplatedProfile
