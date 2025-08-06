'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function EditProfileLoading() {
  return (
    <div className={cn('flex flex-col gap-6 w-full max-w-xl mx-auto p-4')}>
      <div className='flex flex-col items-center gap-4'>
        <Skeleton className='w-24 h-24 rounded-full' />
        <Skeleton className='w-32 h-6 rounded' />
      </div>
      <div className='flex flex-col gap-4'>
        <Skeleton className='w-full h-10 rounded' />
        <Skeleton className='w-full h-10 rounded' />
        <Skeleton className='w-full h-10 rounded' />
      </div>
      <div className='flex justify-end mt-6'>
        <Skeleton className='w-24 h-10 rounded' />
      </div>
    </div>
  )
}

export default EditProfileLoading
