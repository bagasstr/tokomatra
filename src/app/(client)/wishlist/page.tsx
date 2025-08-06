import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const WishlistPage = () => {
  return (
    <div className={cn('')}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/wishlist'>Wishlist</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className='mt-10'>Wishlist</h1>
      <div className='mt-10 space-y-4'>
        <Link
          href='/'
          className='bg-white rounded-lg shadow-sm p-4 flex items-center justify-between'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-x-2'>
              <Image
                src='/logo.png'
                alt='logo'
                width={100}
                height={100}
                className='w-10 h-10 rounded-lg'
              />
              <div className='flex-col ml-4'>
                <h2 className='text-lg font-bold'>Nama Produk</h2>
                <p>Rp. 100.000</p>
              </div>
            </div>
            <Button
              variant={'ghost'}
              size={'icon'}
              className='ml-4 flex-shrink-0'>
              <Trash className='size-4' />
            </Button>
          </div>
        </Link>
      </div>
    </div>
  )
}
export default WishlistPage
