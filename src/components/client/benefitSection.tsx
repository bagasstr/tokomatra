'use client'

import { cn } from '@/lib/utils'
import { Headset, LucideIcon, ShieldCheck, Tag, Truck } from 'lucide-react'

interface BenefitItem {
  icon: LucideIcon // SVG path or icon name
  title: string
  description: string
}

const dataBenefit: BenefitItem[] = [
  {
    icon: Truck,
    title: 'Pengiriman Cepat',
    description:
      'Pesanan Anda dikirim dengan cepat dan aman ke seluruh Indonesia.',
  },
  {
    icon: ShieldCheck,
    title: 'Produk Terjamin',
    description: 'Hanya produk original & bergaransi resmi yang kami jual.',
  },
  {
    icon: Tag,
    title: 'Harga Bersaing',
    description: 'Dapatkan harga terbaik dan promo menarik setiap hari.',
  },
  {
    icon: Headset,
    title: 'Customer Service Siaga',
    description: 'Customer Service siaga 24/7 untuk membantu Anda.',
  },
]

const BenefitSection = () => {
  return (
    <div className={cn('')}>
      <div className={cn('flex flex-col items-center')}>
        <h2 className={cn('')}>Keunggulan Belanja di Sini</h2>
        <p className={cn('text-center text-muted-foreground')}>
          Kami menawarkan berbagai keunggulan yang membuat belanja Anda lebih
          mudah dan menyenangkan.
        </p>
      </div>
      <div
        className={cn(
          'grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4 mt-10'
        )}>
        {dataBenefit.map((item, index) => (
          <div
            key={index}
            className={cn('bg-card rounded-lg p-4 w-[80%] mx-auto')}>
            <div
              className={cn(
                'flex items-center flex-col justify-center gap-x-2'
              )}>
              <div className={cn('flex flex-col items-center')}>
                <item.icon className={cn('w-12 h-12 text-primary')} />
                <h3 className={cn('text-foreground mt-4')}>{item.title}</h3>
              </div>
              <p className={cn('text-muted-foreground text-center')}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default BenefitSection
