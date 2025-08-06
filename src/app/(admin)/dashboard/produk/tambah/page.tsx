'use client'

import FormAddProduct from '@/components/admin/formAddProduct'
import Header from '@/components/ui/header'
import { cn } from '@/lib/utils'

const TambahProdukPage = () => {
  return (
    <div className={cn('py-6')}>
      <Header>
        <h2 className='text-secondary-foreground/80'>Tambah Produk</h2>
      </Header>
      <div className={cn('')}>
        <FormAddProduct />
      </div>
    </div>
  )
}
export default TambahProdukPage
