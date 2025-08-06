import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '../ui/button'

const CategorySection = () => {
  return (
    <div className={cn('')}>
      <div className={cn('flex justify-between items-center')}>
        <h2>Kategori Produk</h2>
        <Link
          href={'/kategori'}
          className={cn('text-primary font-medium text-sm')}>
          Lihat Semua
        </Link>
      </div>
      <div className='grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-4 mt-10'>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Kategori 1</h2>
        </div>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Kategori 1</h2>
        </div>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Kategori 1</h2>
        </div>
        <div className={cn('bg-card rounded-lg p-4')}>
          <h2>Kategori 1</h2>
        </div>
      </div>
    </div>
  )
}
export default CategorySection
