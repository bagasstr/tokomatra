import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '../ui/button'

const FeaturedProductSection = () => {
  return (
    <div className={cn('')}>
      <div className={cn('flex justify-between items-center')}>
        <h2>Produk Unggulan</h2>
      </div>
      <div className='grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-4 mt-10'>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Produk 1</h2>
        </div>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Produk 1</h2>
        </div>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Produk 1</h2>
        </div>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Produk 1</h2>
        </div>
      </div>
    </div>
  )
}
export default FeaturedProductSection
