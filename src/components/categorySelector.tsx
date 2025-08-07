'use client'

import * as React from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown, Plus, ChevronUp } from 'lucide-react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Input } from './ui/input'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { cn } from '@/lib/utils'

interface CategoryChild {
  id_category: string
  name: string
}

export interface Category {
  id_category: string
  name: string
  children?: CategoryChild[]
}

interface CategoryItemProps {
  category: Category
  onSelect?: (category: Category, path: string) => void
  selectedValue?: string
  currentPath?: string
}

function CategoryItem({
  category,
  onSelect,
  selectedValue,
  currentPath = '',
}: CategoryItemProps) {
  const hasChildren =
    category.children && category.children.length > 0 ? true : false
  const [isOpen, setIsOpen] = React.useState(false)
  const [isAdding, setIsAdding] = React.useState(false)
  const [newCategoryName, setNewCategoryName] = React.useState('')
  const [children, setChildren] = React.useState<CategoryChild[]>(
    category.children || []
  )

  const categoryPath = currentPath
    ? `${currentPath} > ${category.name}`
    : category.name
  const isSelected = selectedValue === category.id_category

  function handleAddCategory() {
    if (!newCategoryName.trim()) return
    mutation.mutate({
      parentId: category.id_category,
      name: newCategoryName.trim(),
    })
    setNewCategoryName('')
    setIsAdding(false)
  }

  const mutation = useMutation({
    mutationFn: (data: { parentId: string; name: string }) => {
      // Only send { name } in the body, parentId in the query string
      return fetch(`/api/categories?parentId=${data.parentId}`, {
        method: 'POST',
        body: JSON.stringify({ name: data.name }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  if (!hasChildren && !isAdding)
    return (
      <li className='py-1 flex items-center gap-2'>
        <button
          type='button'
          className={`text-sm text-left w-full hover:bg-muted rounded px-2 py-1 ${
            isSelected ? 'bg-primary text-primary-foreground' : ''
          }`}
          onClick={() => onSelect?.(category, categoryPath)}>
          {category.name}
        </button>
        {/* <Button
          type='button'
          size='icon'
          variant='ghost'
          className='h-6 w-6 p-0'
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
              className={`flex items-center gap-2 py-1 px-2 w-full text-left hover:bg-muted rounded ${
                isSelected ? 'bg-primary text-primary-foreground' : ''
              }`}
              aria-expanded={isOpen}>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden='true'
              />
              <span
                className='text-sm font-medium'
                onClick={(e) => {
                  onSelect?.(category, categoryPath)
                }}>
                {category.name}
              </span>
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
              <CategoryItem
                key={child.id_category}
                category={{
                  id_category: child.id_category,
                  name: child.name,
                  children: [],
                }}
                onSelect={onSelect}
                selectedValue={selectedValue}
                currentPath={categoryPath}
              />
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
  const [selectedPath, setSelectedPath] = React.useState<string>('')
  const [isOpen, setIsOpen] = React.useState(false)

  // Find the selected category path when value changes
  React.useEffect(() => {
    if (value) {
      const findCategoryPath = (
        categories: Category[],
        targetId: string,
        currentPath = ''
      ): string => {
        for (const category of categories) {
          const categoryPath = currentPath
            ? `${currentPath} > ${category.name}`
            : category.name
          if (category.id_category === targetId) {
            return categoryPath
          }
          if (category.children && category.children.length > 0) {
            const found = findCategoryPath(
              category.children as unknown as Category[],
              targetId,
              categoryPath
            )
            if (found) return found
          }
        }
        return ''
      }
      const path = findCategoryPath(data, value)
      setSelectedPath(path)
    } else {
      setSelectedPath('')
    }
  }, [value, data])

  const handleCategorySelect = (category: Category, path: string) => {
    console.log(category)
    onValueChange?.(category.id_category)
    setSelectedPath(path)
    setIsOpen(false) // Close popover after selection
  }

  if (!data || data.length === 0)
    return (
      <div className='text-muted-foreground text-sm'>Tidak ada kategori</div>
    )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          className='w-full justify-between'
          aria-expanded={isOpen}>
          {selectedPath || 'Pilih kategori'}
          <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <div className='p-3'>
          <Input placeholder='Cari kategori...' className='h-10' />
        </div>
        <div className='max-h-60 overflow-y-auto'>
          <ul className='divide-y divide-muted-foreground/20'>
            {data &&
              data.length > 0 &&
              data.map((category) => (
                <CategoryItem
                  key={category.id_category}
                  category={category}
                  onSelect={handleCategorySelect}
                  selectedValue={value}
                />
              ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { CategorySelector }
