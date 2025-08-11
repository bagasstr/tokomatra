'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Folder,
  FolderOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Category, CategorySelectorProps } from '@/lib/type'

const CategorySelector = ({
  value,
  onValueChange,
  placeholder = 'Pilih kategori',
}: CategorySelectorProps) => {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>(value || '')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: '',
    parentId: '',
  })

  const queryClient = useQueryClient()

  // Fetch categories with children
  const {
    data: categoriesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['categories-hierarchy'],
    queryFn: async () => {
      const response = await fetch('/api/categories?limit=1000')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()

      // Build hierarchical structure
      const categories = data.categories || []
      const categoryMap = new Map<string, Category>()
      const rootCategories: Category[] = []

      // First pass: create map of all categories
      categories.forEach((cat: Category) => {
        categoryMap.set(cat.id_category, { ...cat, children: [] })
      })

      // Second pass: build hierarchy
      categories.forEach((cat: Category) => {
        const categoryWithChildren = categoryMap.get(cat.id_category)!
        if (cat.parentId && categoryMap.has(cat.parentId)) {
          const parent = categoryMap.get(cat.parentId)!
          parent.children = parent.children || []
          parent.children.push(categoryWithChildren)
        } else {
          rootCategories.push(categoryWithChildren)
        }
      })

      return rootCategories
    },
  })

  // Add new category with optimistic updates
  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: {
      name: string
      description: string
      parentId: string
    }) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryData.name,
          description: categoryData.description,
          parentId: categoryData.parentId || null,
          slug: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add category')
      }

      return response.json()
    },
    onMutate: async (newCategory) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['categories-hierarchy'] })

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData([
        'categories-hierarchy',
      ])

      // Create optimistic category
      const optimisticCategory: Category = {
        id_category: `temp-${Date.now()}`, // Temporary ID
        name: newCategory.name,
        slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
        description: newCategory.description,
        isActive: true,
        parentId: newCategory.parentId || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [],
      }

      // Optimistically update the cache
      queryClient.setQueryData(
        ['categories-hierarchy'],
        (old: Category[] | undefined) => {
          if (!old) return [optimisticCategory]

          const updateCategories = (categories: Category[]): Category[] => {
            return categories.map((cat) => {
              if (cat.id_category === newCategory.parentId) {
                return {
                  ...cat,
                  children: [...(cat.children || []), optimisticCategory],
                }
              }
              if (cat.children) {
                return {
                  ...cat,
                  children: updateCategories(cat.children),
                }
              }
              return cat
            })
          }

          // If no parent, add to root level
          if (!newCategory.parentId) {
            return [...old, optimisticCategory]
          }

          return updateCategories(old)
        }
      )

      return { previousCategories }
    },
    onError: (err, newCategory, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueryData(
          ['categories-hierarchy'],
          context.previousCategories
        )
      }
      toast.error('Gagal menambahkan kategori')
      console.error('Error adding category:', err)
    },
    onSuccess: (data, newCategory) => {
      toast.success('Kategori berhasil ditambahkan')
      setIsAddDialogOpen(false)
      setNewCategoryData({ name: '', description: '', parentId: '' })

      // Refetch to get the real data with correct IDs
      queryClient.invalidateQueries({ queryKey: ['categories-hierarchy'] })
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['categories-hierarchy'] })
    },
  })

  const addCategory = async () => {
    if (!newCategoryData.name.trim()) return

    addCategoryMutation.mutate({
      name: newCategoryData.name,
      description: newCategoryData.description,
      parentId: newCategoryData.parentId,
    })
  }

  const toggleCategory = (categoryId: string) => {
    const newOpenCategories = new Set(openCategories)
    if (newOpenCategories.has(categoryId)) {
      newOpenCategories.delete(categoryId)
    } else {
      newOpenCategories.add(categoryId)
    }
    setOpenCategories(newOpenCategories)
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    onValueChange?.(categoryId)
  }

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isOpen = openCategories.has(category.id_category)
    const isSelected = selectedCategory === category.id_category
    const isOptimistic = category.id_category.startsWith('temp-')

    return (
      <div key={category.id_category} className='w-full'>
        <div className='flex items-center gap-2'>
          {hasChildren ? (
            <Collapsible
              open={isOpen}
              onOpenChange={() => toggleCategory(category.id_category)}>
              <CollapsibleTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-6 w-6 p-0 hover:bg-transparent'>
                  {isOpen ? (
                    <ChevronDown className='h-4 w-4' />
                  ) : (
                    <ChevronRight className='h-4 w-4' />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='ml-4 mt-1 space-y-1'>
                  {category.children?.map((child) =>
                    renderCategory(child, level + 1)
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className='w-6' />
          )}

          <Button
            variant='ghost'
            size='sm'
            className={cn(
              'justify-start h-8 px-2 text-sm',
              isSelected && 'bg-primary text-primary-foreground',
              isOptimistic && 'opacity-60'
            )}
            onClick={() => handleCategorySelect(category.id_category)}
            disabled={isOptimistic}>
            {hasChildren ? (
              isOpen ? (
                <FolderOpen className='h-4 w-4 mr-2' />
              ) : (
                <Folder className='h-4 w-4 mr-2' />
              )
            ) : (
              <div className='w-4 h-4 mr-2' />
            )}
            {category.name}
            {isOptimistic && (
              <span className='ml-2 text-xs text-muted-foreground'>
                (menyimpan...)
              </span>
            )}
          </Button>
        </div>
      </div>
    )
  }

  const getSelectedCategoryName = () => {
    if (!selectedCategory || !categoriesData) return placeholder

    const findCategory = (
      categories: Category[],
      id: string
    ): Category | null => {
      for (const category of categories) {
        if (category.id_category === id) return category
        if (category.children) {
          const found = findCategory(category.children, id)
          if (found) return found
        }
      }
      return null
    }

    const category = findCategory(categoriesData, selectedCategory)
    return category?.name || placeholder
  }

  if (isLoading) {
    return (
      <div className='text-sm text-muted-foreground'>Memuat kategori...</div>
    )
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <Label>Kategori Produk</Label>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='h-8'
              disabled={addCategoryMutation.isPending}>
              <Plus className='h-4 w-4 mr-1' />
              {addCategoryMutation.isPending
                ? 'Menambahkan...'
                : 'Tambah Kategori'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kategori Baru</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='category-name'>Nama Kategori</Label>
                <Input
                  id='category-name'
                  value={newCategoryData.name}
                  onChange={(e) =>
                    setNewCategoryData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder='Masukkan nama kategori'
                  disabled={addCategoryMutation.isPending}
                />
              </div>
              <div>
                <Label htmlFor='category-description'>
                  Deskripsi (Opsional)
                </Label>
                <Input
                  id='category-description'
                  value={newCategoryData.description}
                  onChange={(e) =>
                    setNewCategoryData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder='Masukkan deskripsi kategori'
                  disabled={addCategoryMutation.isPending}
                />
              </div>
              <div>
                <Label htmlFor='category-parent'>
                  Kategori Induk (Opsional)
                </Label>
                <select
                  id='category-parent'
                  value={newCategoryData.parentId}
                  onChange={(e) =>
                    setNewCategoryData((prev) => ({
                      ...prev,
                      parentId: e.target.value,
                    }))
                  }
                  className='w-full p-2 border rounded-md'
                  disabled={addCategoryMutation.isPending}>
                  <option value=''>Pilih kategori induk</option>
                  {categoriesData?.map((category: Category) => (
                    <option
                      key={category.id_category}
                      value={category.id_category}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex justify-end gap-2'>
                <Button
                  variant='outline'
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={addCategoryMutation.isPending}>
                  Batal
                </Button>
                <Button
                  onClick={addCategory}
                  disabled={
                    !newCategoryData.name.trim() ||
                    addCategoryMutation.isPending
                  }>
                  {addCategoryMutation.isPending
                    ? 'Menambahkan...'
                    : 'Tambah Kategori'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='border rounded-md p-3 min-h-[200px] max-h-[300px] overflow-y-auto'>
        {categoriesData && categoriesData.length > 0 ? (
          <div className='space-y-1'>
            {categoriesData.map((category: Category) =>
              renderCategory(category)
            )}
          </div>
        ) : (
          <div className='text-sm text-muted-foreground text-center py-8'>
            Belum ada kategori. Tambahkan kategori pertama Anda.
          </div>
        )}
      </div>

      {selectedCategory && (
        <div className='text-sm text-muted-foreground'>
          Kategori terpilih:{' '}
          <span className='font-medium'>{getSelectedCategoryName()}</span>
        </div>
      )}
    </div>
  )
}

export default CategorySelector
