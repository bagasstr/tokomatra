'use client'

import FilterPesananDashboard from '@/components/admin/filterPesananDashboard'
import TablePesananDashboard from '@/components/admin/tablePesananDashboard'
import Header from '@/components/ui/header'
import { cn } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

const PesananPage = () => {
  return (
    <div className={cn('py-6')}>
      <Header>
        <h2 className='text-secondary-foreground/80'>Daftar Pesanan</h2>
      </Header>
      <div
        className={cn(
          'flex items-center gap-2 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 p-4 rounded-md mb-6'
        )}>
        <AlertTriangle className={cn('w-5 h-5 text-orange-500')} />
        <div>
          <h5 className={cn('text-orange-800')}>
            Ada Pesanan yang Perlu Konfirmasi Supplier
          </h5>
          <p className={cn('text-orange-700')}>
            1 pesanan telah dikonfirmasi. Silakan hubungi supplier untuk
            konfirmasi ketersediaan barang.
          </p>
        </div>
      </div>
      <div className={cn('')}>
        <FilterPesananDashboard />
        <TablePesananDashboard />
      </div>
    </div>
  )
}
export default PesananPage
