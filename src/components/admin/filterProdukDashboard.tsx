'use client'

import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

const FilterProdukDashboard = () => {
  return (
    <div className={cn('flex items-center justify-between gap-2 mb-6')}>
      <div className={cn('relative w-64')}>
        <Input placeholder='Cari produk...' className='pl-10' />
        <Search className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
      </div>
      <div className={cn('relative')}>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Filter' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Semua Status</SelectItem>
            <SelectItem value='active'>Aktif</SelectItem>
            <SelectItem value='inactive'>Nonaktif</SelectItem>
            <SelectItem value='outOfStock'>Stok Habis</SelectItem>
            <SelectItem value='lowStock'>Stok Menipis</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
export default FilterProdukDashboard
