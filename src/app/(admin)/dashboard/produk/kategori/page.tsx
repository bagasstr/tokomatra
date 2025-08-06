'use client'

import FilterProdukDashboard from '@/components/admin/filterProdukDashboard'
import { Button } from '@/components/ui/button'
import Header from '@/components/ui/header'
import {
  Table,
  TableRow,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ChevronUp, Edit, Plus, Trash } from 'lucide-react'

const KategoriPage = () => {
  return (
    <div className={cn('py-6')}>
      <Header>
        <h2 className={cn('text-secondary-foreground/80')}>Daftar Kategori</h2>
        <Button size='lg'>
          <Plus className='w-4 h-4' />
          Tambah Kategori
        </Button>
      </Header>
      <div className={cn('')}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead className={cn('w-[65%]')}>Nama Kategori</TableHead>
              <TableHead className={cn('w-[15%]')}>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Kategori 1</TableCell>
              <TableCell
                className={cn('flex items-center gap-2 justify-center')}>
                <Button size='sm' variant={'outline'}>
                  <Plus className='w-4 h-4' />
                </Button>
                <Button size='sm' variant={'outline'}>
                  <Edit className='w-4 h-4' />
                </Button>
                <Button size='sm' variant={'outline'}>
                  <Trash className='w-4 h-4' />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>
                <div className={cn('flex items-center gap-2')}>
                  <ChevronUp className='w-4 h-4' />
                  Kategori 2
                </div>
              </TableCell>
              <TableCell className={cn('flex items-center gap-2')}>
                <Button size='sm' variant={'outline'}>
                  <Plus className='w-4 h-4' />
                </Button>
                <Button size='sm' variant={'outline'}>
                  <Edit className='w-4 h-4' />
                </Button>
                <Button size='sm' variant={'outline'}>
                  <Trash className='w-4 h-4' />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default KategoriPage
