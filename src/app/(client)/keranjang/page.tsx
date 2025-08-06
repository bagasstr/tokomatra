import CartsSection from '@/components/client/cartsSection'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const KeranjangPage = () => {
  return (
    <div className={cn('')}>
      <div className={cn('flex items-center gap-2')}>
        <Link
          href={'/'}
          className={cn('flex items-center gap-2 hover:underline')}>
          <ArrowLeft className='w-4 h-4' />
          Kembali
        </Link>
      </div>
      <CartsSection />
    </div>
  )
}
export default KeranjangPage
