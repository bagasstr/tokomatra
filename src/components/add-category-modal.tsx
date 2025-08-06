'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Folder } from 'lucide-react'

const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters'),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface Category {
  id: string
  name: string
  children?: Category[]
}

interface AddCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentCategory?: Category | null
  parentPath?: string[]
  onCategoryAdded?: (newCategory: Category) => void
}

export function AddCategoryModal({
  open,
  onOpenChange,
  parentCategory,
  parentPath = [],
  onCategoryAdded,
}: AddCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      icon: '',
      isActive: true,
    },
  })

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Update slug when name changes
  const handleNameChange = (name: string) => {
    form.setValue('name', name)
    if (!form.getValues('slug')) {
      form.setValue('slug', generateSlug(name))
    }
  }

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true)
    try {
      // Generate a unique ID (in real app, this would come from the database)
      const newCategoryId = `${data.slug}-${Date.now()}`

      const newCategory: Category = {
        id: newCategoryId,
        name: data.name,
        children: [],
      }

      console.log('Creating new category:', {
        ...data,
        parentId: parentCategory?.id,
        parentPath: parentPath,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the callback to update the parent component
      if (onCategoryAdded) {
        onCategoryAdded(newCategory)
      }

      // Reset form and close modal
      form.reset()
      onOpenChange(false)

      alert(`Category "${data.name}" added successfully!`)
    } catch (error) {
      console.error('Error adding category:', error)
      alert('Error adding category. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Folder className='h-5 w-5 text-blue-600' />
            Add New Category
          </DialogTitle>
          <DialogDescription>
            Create a new category
            {parentCategory ? ` under "${parentCategory.name}"` : ''}.
          </DialogDescription>
        </DialogHeader>

        {/* Parent Category Path */}
        {parentPath.length > 0 && (
          <div className='space-y-2'>
            <div className='text-sm font-medium text-muted-foreground'>
              Parent Category:
            </div>
            <Badge variant='outline' className='text-sm'>
              {parentPath.join(' > ')}
            </Badge>
            <Separator />
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Basic Information */}
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter category name'
                        {...field}
                        onChange={(e) => handleNameChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input placeholder='category-url-slug' {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be used in URLs. Leave empty to auto-generate
                      from name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter category description'
                        className='min-h-[80px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Additional Settings */}
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='icon'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g., laptop, shirt, home'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Icon name for display</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-sm font-medium'>
                        Active Category
                      </FormLabel>
                      <FormDescription className='text-xs'>
                        Make this category visible and available for selection.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className='gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
