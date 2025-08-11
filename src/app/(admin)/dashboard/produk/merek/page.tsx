'use client'

import ModalAddMerek from '@/components/admin/modalAddMerek'
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
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

const MerekPage = () => {
  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => fetch('/api/brands').then((res) => res.json()),
  })
  return (
    <div className={cn('py-6')}>
      <Header>
        <h2 className={cn('text-secondary-foreground/80')}>Daftar Merek</h2>
        <ModalAddMerek />
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
            {brands?.map((brand: any) => (
              <TableRow key={brand.id_brand}>
                <TableCell>
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={100}
                    height={100}
                  />
                </TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.slug}</TableCell>
                <TableCell>
                  <div className={cn('flex items-center gap-2')}>
                    <Button size='sm' variant={'outline'}>
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button size='sm' variant={'outline'}>
                      <Trash className='w-4 h-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default MerekPage
