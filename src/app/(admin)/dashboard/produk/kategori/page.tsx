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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronUp, ChevronDown, Edit, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ModalAddCategory from '@/components/admin/modalAddCategory'

interface CategoryChild {
  id_category: string
  name: string
  children?: CategoryChild[]
}

interface Category {
  id_category: string
  name: string
  children?: CategoryChild[]
}

interface CategoryRowProps {
  category: Category
  depth?: number
}

function CategoryRow({ category, depth = 0 }: CategoryRowProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = category.children && category.children.length > 0
  const isOptimistic = category.id_category.startsWith('temp-')

  // Skip rendering if category name is empty
  if (!category.name) {
    return null
  }

  // Truncate ID for better display
  const truncatedId =
    category.id_category.length > 12
      ? `${category.id_category.slice(0, 8)}...${category.id_category.slice(
          -4
        )}`
      : category.id_category

  return (
    <>
      <TableRow className={cn(isOptimistic && 'opacity-60')}>
        <TableCell className={cn('font-mono text-xs text-muted-foreground')}>
          {truncatedId}
        </TableCell>
        <TableCell>
          <div className={cn('flex items-center gap-2')}>
            {hasChildren ? (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-6 w-6 p-0 hover:bg-muted'>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isOpen ? 'rotate-180' : ''
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            ) : (
              <div className='w-6' />
            )}
            <span
              className={cn(
                'text-sm font-medium',
                depth > 0 && 'ml-4',
                depth === 1 && 'ml-6',
                depth === 2 && 'ml-8',
                depth >= 3 && 'ml-10'
              )}>
              {category.name}
              {isOptimistic && (
                <span className='ml-2 text-xs text-muted-foreground'>
                  (menyimpan...)
                </span>
              )}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className={cn('flex items-center gap-1')}>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size='sm'
                  variant={'outline'}
                  className='h-8 w-8 p-0'
                  disabled={isOptimistic}>
                  <Plus className='w-3 h-3' />
                </Button>
              </DialogTrigger>
              <DialogContent
                className={cn('desktop:max-w-md desktop:mx-auto px-2')}>
                <DialogHeader className={cn('mb-4')}>
                  <DialogTitle>Tambah Kategori</DialogTitle>
                </DialogHeader>
                <ModalAddCategory parentId={category.id_category} />
              </DialogContent>
            </Dialog>
            <Button
              size='sm'
              variant={'outline'}
              className='h-8 w-8 p-0'
              disabled={isOptimistic}>
              <Edit className='w-3 h-3' />
            </Button>
            <Button
              size='sm'
              variant={'outline'}
              className='h-8 w-8 p-0'
              disabled={isOptimistic}>
              <Trash className='w-3 h-3' />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {hasChildren && isOpen && (
        <>
          {category.children?.map((child) => (
            <CategoryRow
              key={child.id_category}
              category={{
                id_category: child.id_category,
                name: child.name,
                children: child.children || [],
              }}
              depth={depth + 1}
            />
          ))}
        </>
      )}
    </>
  )
}

const KategoriPage = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categoriesDashboard'],
    queryFn: () => {
      return fetch('/api/categories').then((res) => res.json())
    },
  })

  // Filter out categories with empty names
  const validCategories =
    categories?.filter((category: Category) => category.name) || []

  return (
    <div className={cn('py-6')}>
      <Header>
        <h2 className={cn('text-secondary-foreground/80')}>Daftar Kategori</h2>
      </Header>
      <div className={cn('')}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={cn('w-[20%]')}>ID</TableHead>
              <TableHead className={cn('w-[65%]')}>Nama Kategori</TableHead>
              <TableHead className={cn('w-[15%]')}>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className={cn('text-center py-8')}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : validCategories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className={cn('text-center py-8 text-muted-foreground')}>
                  Tidak ada kategori
                </TableCell>
              </TableRow>
            ) : (
              validCategories.map((category: Category) => (
                <CategoryRow key={category.id_category} category={category} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default KategoriPage
