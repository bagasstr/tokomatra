'use client'

import * as React from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown, Plus } from 'lucide-react'
import { Button } from './ui/button'
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectGroup,
} from './ui/select'
import { Input } from './ui/input'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'

export interface Category {
  id: number
  name: string
  children: Category[]
}

interface CategoryItemProps {
  category: Category
}

function CategoryItem({ category }: CategoryItemProps) {
  const hasChildren = category.children && category.children.length > 0
  const [isOpen, setIsOpen] = React.useState(false)
  const [isAdding, setIsAdding] = React.useState(false)
  const [newCategoryName, setNewCategoryName] = React.useState('')
  const [children, setChildren] = React.useState<Category[]>(category.children)

  function handleAddCategory() {
    if (!newCategoryName.trim()) return
    mutation.mutate({
      id: Date.now(),
      name: newCategoryName.trim(),
      children: [],
    })
    setNewCategoryName('')
    setIsAdding(false)
  }

  const mutation = useMutation({
    mutationFn: (data: Category) => {
      return fetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  if (!hasChildren && !isAdding)
    return (
      <li className='pl-6 py-1 flex items-center gap-2'>
        <span className='text-sm'>{category.name}</span>
        {/* <Button
          type='button'
          size='icon'
          variant='ghost'
          className='h-6 w-6 p-0 ml-2'
          aria-label='Tambah subkategori'
          onClick={() => setIsAdding(true)}>
          <Plus className='h-4 w-4' />
        </Button> */}
      </li>
    )

  return (
    <li>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className='flex items-center gap-2'>
          <CollapsibleTrigger asChild>
            <button
              className='flex items-center gap-2 py-1 px-2 w-full text-left hover:bg-muted rounded'
              aria-expanded={isOpen}>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden='true'
              />
              <span className='text-sm font-medium'>{category.name}</span>
            </button>
          </CollapsibleTrigger>
          <Button
            type='button'
            size='icon'
            variant='ghost'
            className='h-6 w-6 p-0'
            aria-label='Tambah subkategori'
            onClick={() => setIsAdding(true)}>
            <Plus className='h-4 w-4' />
          </Button>
        </div>
        {isAdding && (
          <div className='flex items-center gap-2 mt-2 ml-8'>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder='Nama subkategori'
              className='h-8 w-40 text-sm focus-visible:border-input focus-visible:ring-0'
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCategory()
                if (e.key === 'Escape') {
                  setIsAdding(false)
                  setNewCategoryName('')
                }
              }}
              autoFocus
            />
            <Button
              type='button'
              size='sm'
              variant='default'
              className='h-8 px-2'
              onClick={handleAddCategory}>
              Tambah
            </Button>
            <Button
              type='button'
              size='icon'
              variant='ghost'
              className='h-8 w-8'
              aria-label='Batal'
              onClick={() => {
                setIsAdding(false)
                setNewCategoryName('')
              }}>
              ×
            </Button>
          </div>
        )}
        <CollapsibleContent>
          <ul className='ml-4 border-l border-muted-foreground/20 pl-2'>
            {children.map((child) => (
              <CategoryItem key={child.id} category={child} />
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}

interface CategorySelectorProps {
  data: Category[]
  value?: string
  onValueChange?: (value: string) => void
}

function CategorySelector({
  data,
  value,
  onValueChange,
}: CategorySelectorProps) {
  if (!data || data.length === 0)
    return (
      <div className='text-muted-foreground text-sm'>Tidak ada kategori</div>
    )

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder='Pilih kategori' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Kategori Produk</SelectLabel>
          {data.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { CategorySelector }
