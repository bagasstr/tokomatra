'use client'

import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Minus, Plus, Trash } from 'lucide-react'
import { Input } from '../ui/input'

const CartsSection = () => {
  return (
    <div className={cn('mt-5')}>
      <div className={cn('flex items-center gap-2')}>
        <h1>Keranjang Belanja</h1>
      </div>
      <div className={cn('mt-10')}>
        <div className={cn('flex items-center gap-2')}>
          <Checkbox />
          <Label>Pilih Semua</Label>
        </div>
        <div className={cn('flex items-start gap-4 mt-5')}>
          <div
            className={cn(
              'flex items-start justify-between gap-4 p-4 w-full shadow-sm'
            )}>
            <div className={cn('flex items-center gap-4')}>
              <Checkbox />
              <Image
                src={'/images/product-1.jpg'}
                alt='product'
                width={100}
                height={100}
                className=''
              />
              <div className={cn('')}>
                <h4>Nama Produk</h4>
                <h5 className={cn('font-normal')}>Rp. 100.000</h5>
                <div className={cn('flex items-center gap-2 mt-2')}>
                  <Button variant={'outline'} size={'icon'}>
                    <Minus className='size-3' />
                  </Button>
                  <Input type='text' className='w-10' value={1} />
                  <Button variant={'outline'} size={'icon'}>
                    <Plus className='size-3' />
                  </Button>
                </div>
              </div>
            </div>
            <div className={cn('flex flex-col items-end')}>
              <p>Rp. 100.000</p>
              <Button variant={'ghost'} size={'icon'}>
                <Trash className='w-4 h-4 text-destructive' />
              </Button>
            </div>
          </div>
          <div className={cn('gap-4 p-4 shrink-0 shadow-sm w-[35%]')}>
            <h3>Ringkasan Pesanan</h3>
            <div className={cn('flex items-center justify-between')}>
              <p>Subtotal</p>
              <p>Rp. 100.000</p>
            </div>
            <div className={cn('flex items-center justify-between')}>
              <p>PPN 11%</p>
              <p>Rp. 10.000</p>
            </div>
            <div className={cn('flex items-center justify-between')}>
              <p>Ongkir</p>
              <p>Rp. 10.000</p>
            </div>
            <div className={cn('flex items-center justify-between')}>
              <p>Total Berat</p>
              <p>100 gr</p>
            </div>
            <div className={cn('flex items-center justify-between')}>
              <p>Total</p>
              <p>Rp. 110.000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CartsSection
