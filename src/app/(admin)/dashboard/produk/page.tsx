'use client'

import FilterProdukDashboard from '@/components/admin/filterProdukDashboard'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Header from '@/components/ui/header'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Edit, Eye, MoreHorizontal, Plus, Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const ProdukPage = () => {
  return (
    <div className={cn('py-6')}>
      <Header>
        <h2 className='text-secondary-foreground/80'>Daftar Produk</h2>
        <Link href='/dashboard/produk/tambah'>
          <Button size='lg' className='flex items-center'>
            <Plus className='' />
            <p>Tambah Produk</p>
          </Button>
        </Link>
      </Header>

      <div className={cn('flex items-center justify-between')}>
        <FilterProdukDashboard />
      </div>
      <div className={cn('')}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=''>
                <Checkbox />
              </TableHead>
              <TableHead>Gambar</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead>Harga Beli</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='h-full '>
                <Checkbox />
              </TableCell>
              <TableCell className=''>
                <Image
                  src={'/logo.png'}
                  alt='gambar'
                  width={50}
                  height={50}
                  style={{ objectFit: 'contain' }}
                  className='rounded-md'
                />
              </TableCell>
              <TableCell>GMB001</TableCell>
              <TableCell>Gambar</TableCell>
              <TableCell>image</TableCell>
              <TableCell>Rp. 100.000</TableCell>
              <TableCell>Rp. 80.000</TableCell>
              <TableCell>100</TableCell>
              <TableCell>Aktif</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreHorizontal className='size-4' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className='size-4' />
                      Lihat
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className='size-4' />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash className='size-4' />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className={cn('mt-6')}>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href='#' />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive href='/dashboard/produk?page=1'>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href='#' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
export default ProdukPage
