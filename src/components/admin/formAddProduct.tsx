'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CloudUpload, Paperclip } from 'lucide-react'
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload'
import { Switch } from '@/components/ui/switch'
import { formAddProductSchema } from '@/lib/validation'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Category, CategorySelector } from '@/components/categorySelector'

const FormAddProduct = () => {
  const [files, setFiles] = useState<File[] | null>(null)
  const router = useRouter()
  const [slugEdited, setSlugEdited] = useState(false)

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  }

  const labels = [
    { value: 'ready_stock', label: 'Ready Stock' },
    { value: 'suplier', label: 'Suplier' },
  ]

  const categories = [
    {
      id: 1,
      name: 'Elektronik',
      children: [
        { id: 2, name: 'Laptop' },
        { id: 3, name: 'Handphone' },
      ],
    },
    {
      id: 4,
      name: 'Pakaian',
      children: [
        {
          id: 5,
          name: 'Pria',
        },
      ],
    },
  ]
  const form = useForm<z.infer<typeof formAddProductSchema>>({
    resolver: zodResolver(formAddProductSchema),
    defaultValues: {},
    mode: 'onChange',
  })

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .trim()
      .replace(/\s+/g, '-')
  }

  useEffect(() => {
    const subscription = form.watch((values, { name, type }) => {
      if (name === 'name' && !slugEdited) {
        form.setValue('slug', generateSlug(values.name || ''))
      }
    })
    return () => subscription.unsubscribe()
  }, [form, slugEdited])

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugEdited(true)
    form.setValue('slug', e.target.value)
  }

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formAddProductSchema>) => {
      return fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(values),
      })
    },

    onSuccess: () => {
      toast.success('Produk berhasil ditambahkan')
      router.push('/dashboard/produk')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function onSubmit(values: z.infer<typeof formAddProductSchema>) {
    try {
      mutation.mutate(values)
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Failed to submit the form. Please try again.')
    }
  }

  return (
    <div className={cn('')}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='sku'
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='SKU unik'
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Produk</FormLabel>
                <FormControl>
                  <Input placeholder='Bata merah' type='text' {...field} />
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
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Slug'
                    type='text'
                    {...field}
                    onChange={(e) => handleSlugChange(e)}
                  />
                </FormControl>
                <FormDescription>
                  Slug terisi otomatis sesuai input nama produk
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
                <FormLabel>Deskripsi Produk</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Deskripsi produk'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Deskripsi produk, isi secara detail tentang produk
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='categoryId'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CategorySelector
                    data={categories as Category[]}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Pilih kategori yang paling spesifik untuk produk Anda. Anda
                  juga dapat menambahkan kategori baru.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='label'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Label produk' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {labels.map((label) => (
                      <SelectItem key={label.value} value={label.value}>
                        {label.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Label produk ready stock atau suplier
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='sellingPrice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Jual Produk</FormLabel>
                    <FormControl>
                      <Input placeholder='' type='text' {...field} />
                    </FormControl>
                    <FormDescription>
                      Harga yang akan di bayar pelanggan
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='purchasePrice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Pembelian Produk</FormLabel>
                    <FormControl>
                      <Input placeholder='' type='text' {...field} />
                    </FormControl>
                    <FormDescription>
                      Harga pembelian atau modal produk
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='stock'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok Produk</FormLabel>
                    <FormControl>
                      <Input placeholder='1000' type='text' {...field} />
                    </FormControl>
                    <FormDescription>
                      Stok produk hanya untuk produk yang ready stock
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='unit'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Satuan</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Kg, Pcs, dll'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Satuan produk</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='minOrder'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimal Pembelian</FormLabel>
                    <FormControl>
                      <Input placeholder='' type='text' {...field} />
                    </FormControl>
                    <FormDescription>
                      Jumlah minimal pembelian yang harus di beli pelanggan
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='multiOrder'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelipatan Order</FormLabel>
                    <FormControl>
                      <Input placeholder='' type='text' {...field} />
                    </FormControl>
                    <FormDescription>
                      Jumlah kelipatan pembelian
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='dimensions'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensi Produk</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='15cm x 10cm x 5cm'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Dimensi ukuran produk. PxLxT
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='weight'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Berat Produk</FormLabel>
                    <FormControl>
                      <Input placeholder='shadcn' type='text' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gambar Produk</FormLabel>
                <FormControl>
                  <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    dropzoneOptions={dropZoneConfig}
                    className='relative bg-background rounded-lg p-2'>
                    <FileInput
                      id='fileInput'
                      className='outline-dashed outline-1 outline-slate-500'>
                      <div className='flex items-center justify-center flex-col p-8 w-full '>
                        <CloudUpload className='text-gray-500 w-10 h-10' />
                        <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
                          <span className='font-semibold'>Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          SVG, PNG, JPG or GIF
                        </p>
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {files &&
                        files.length > 0 &&
                        files.map((file, i) => (
                          <FileUploaderItem key={i} index={i}>
                            <Paperclip className='h-4 w-4 stroke-current' />
                            <span>{file.name}</span>
                          </FileUploaderItem>
                        ))}
                    </FileUploaderContent>
                  </FileUploader>
                </FormControl>
                <FormDescription>
                  File harus berupa gambar. PNG, JPG, JPEG
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='featured'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel>Produk Unggulan</FormLabel>
                  <FormDescription>
                    Aktifkan sebagai produk unggulan
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled
                    aria-readonly
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className='flex justify-end gap-2'>
            <Link href='/dashboard/produk'>
              <Button type='button' variant='outline' className=''>
                Batal
              </Button>
            </Link>
            <Button type='submit' className='' disabled={mutation.isPending}>
              {mutation.isPending ? 'Menambahkan...' : 'Tambah Produk'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default FormAddProduct
