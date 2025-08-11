'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Header from '@/components/ui/header'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { formAddCategorySchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '../ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const ModalAddCategory = ({ parentId }: { parentId: string }) => {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formAddCategorySchema>>({
    resolver: zodResolver(formAddCategorySchema),
    defaultValues: {
      name: '',
      parentId: parentId,
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formAddCategorySchema>) => {
      return await fetch(`/api/categories?parentId=${data.parentId}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    },
    onMutate: async (newCategory) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['categoriesDashboard'] })

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData([
        'categoriesDashboard',
      ])

      // Create optimistic category
      const optimisticCategory = {
        id_category: `temp-${Date.now()}`,
        name: newCategory.name,
        children: [],
      }

      // Optimistically update the cache
      queryClient.setQueryData(['categoriesDashboard'], (old: any) => {
        if (!old) return old

        const updateCategoryChildren = (categories: any[]): any[] => {
          return categories.map((cat) => {
            if (cat.id_category === newCategory.parentId) {
              return {
                ...cat,
                children: [...(cat.children || []), optimisticCategory],
              }
            }
            if (cat.children && cat.children.length > 0) {
              return {
                ...cat,
                children: updateCategoryChildren(cat.children),
              }
            }
            return cat
          })
        }

        return updateCategoryChildren(old)
      })

      return { previousCategories }
    },
    onError: (err, newCategory, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueryData(
          ['categoriesDashboard'],
          context.previousCategories
        )
      }
      toast.error('Kategori gagal ditambahkan')
    },
    onSuccess: (data) => {
      toast.success('Kategori berhasil ditambahkan')
      form.reset()
      // Refetch to get the real data with correct IDs
      queryClient.invalidateQueries({ queryKey: ['categoriesDashboard'] })
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['categoriesDashboard'] })
    },
  })
  const onSubmit = (data: z.infer<typeof formAddCategorySchema>) => {
    mutation.mutate(data)
  }
  return (
    <div className={cn('')}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className={cn('')}>
                <FormLabel>Nama Kategori</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className={cn(
                      'focus-visible:border-1 focus-visible:shadow-xs focus-visible:ring-0'
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className={cn('flex justify-end gap-2 mt-4')}>
            <Button type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? 'Menambahkan...' : 'Tambah'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
export default ModalAddCategory
