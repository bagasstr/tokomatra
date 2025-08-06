'use client'

import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Search } from 'lucide-react'

const FilterPesananDashboard = () => {
  return (
    <div className={cn('flex items-center justify-between gap-2 mb-6')}>
      <div className='relative w-64'>
        <Input placeholder='Cari pesanan...' className='w-full pl-8' />
        <Search className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
      </div>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder='Pilih Status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Semua</SelectItem>
          <SelectItem value='pending'>Menunggu Konfirmasi</SelectItem>
          <SelectItem value='confirmed'>Dikonfirmasi</SelectItem>
          <SelectItem value='rejected'>Ditolak</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
export default FilterPesananDashboard
