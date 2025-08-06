'use client'

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
import { Edit, Plus, Trash } from 'lucide-react'

const MerekPage = () => {
  return (
    <div className={cn('py-6')}>
      <Header>
        <h2 className={cn('text-secondary-foreground/80')}>Daftar Merek</h2>
        <Button size='lg'>
          <Plus className='w-4 h-4' />
          Tambah Merek
        </Button>
      </Header>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Nama Merek</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className={cn('w-[15%]')}>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Nama Merek</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell className={cn('flex items-center gap-2')}>
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
export default MerekPage
