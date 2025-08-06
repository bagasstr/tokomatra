import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '../ui/button'

const BrandsSection = () => {
  return (
    <div className={cn('')}>
      <div className={cn('flex justify-between items-center')}>
        <h2>Merek Terkenal</h2>
      </div>
      <div className='flex gap-x-4 overflow-x-auto mt-10'>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Merek 1</h2>
        </div>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Merek 1</h2>
        </div>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Merek 1</h2>
        </div>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Merek 1</h2>
        </div>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Merek 1</h2>
        </div>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Merek 1</h2>
        </div>
      </div>
    </div>
  )
}
export default BrandsSection
