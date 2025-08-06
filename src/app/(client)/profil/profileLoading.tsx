'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function ProfileLoading() {
  return (
    <div className='flex flex-col gap-6 container p-4'>
      <div className='flex items-center gap-4'>
        <Skeleton className='w-20 h-20 rounded-full' />
        <div className='flex-1 space-y-3'>
          <Skeleton className='h-6 w-1/2' />
          <Skeleton className='h-4 w-1/3' />
        </div>
      </div>
      <div className='space-y-4'>
        <Skeleton className='h-5 w-1/3' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
        <Skeleton className='h-4 w-2/3' />
      </div>
      <div className='flex gap-4 mt-6'>
        <Skeleton className='h-10 w-32 rounded-md' />
        <Skeleton className='h-10 w-32 rounded-md' />
      </div>
    </div>
  )
}

export default ProfileLoading
