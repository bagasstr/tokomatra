'use client'

import { queryClient } from '@/lib/queryClient'
import { IProfile } from '@/lib/type'
import { formEditProfileAdminSchema } from '@/lib/validation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
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
import Header from '@/components/ui/header'
import { CloudUpload } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from '@/components/ui/file-upload'

const EditProfileAdmin = () => {
  const id = useSearchParams().get('id')
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery<IProfile>({
    queryKey: ['admin-profile', id],
    queryFn: async () => {
      const res = await fetch(`/api/profile-admin?id=${id}`)
      if (!res.ok) throw new Error('Gagal memuat profil')
      return await res.json()
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: IProfile) => {
      const res = await fetch(`/api/profile-admin?id=${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data.data.profile),
      })
      if (!res.ok) throw new Error('Gagal memuat profil')
      return await res.json()
    },
    onMutate: (data) => {
      queryClient.cancelQueries({ queryKey: ['admin-profile', id] })
      const previousData = queryClient.getQueryData(['admin-profile', id])
      queryClient.setQueryData(['admin-profile', id], data)
      return { previousData }
    },
    onSuccess: () => {
      toast.success('Profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-profile', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] })
    },
    onError: (error, data, context) => {
      toast.error('Gagal memuat profil')
      queryClient.setQueryData(['admin-profile', id], context?.previousData)
    },
  })

  const onSubmit = (data: z.infer<typeof formEditProfileAdminSchema>) => {
    mutation.mutate({
      data: {
        profile: {
          id_profile: profile?.data?.profile?.id_profile ?? '',
          createdAt: profile?.data?.profile?.createdAt ?? new Date(),
          updatedAt: profile?.data?.profile?.updatedAt ?? new Date(),
          fullName: data.fullName,
          userName: data.userName,
          phoneNumber: data.phoneNumber,
          taxId: data.taxId,
          imageUrl: data.imageUrl ?? '',
        },
      },
    })
  }
  const form = useForm<z.infer<typeof formEditProfileAdminSchema>>({
    resolver: zodResolver(formEditProfileAdminSchema),
    defaultValues: {
      fullName: '',
      imageUrl: '',
      userName: '',
      phoneNumber: '',
      taxId: '',
    },
  })

  const [files, setFiles] = useState<File[] | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!files || files.length === 0) return
    ;(async () => {
      try {
        setIsUploading(true)
        const fd = new FormData()
        fd.append('file', files[0])
        const res = await fetch('/api/uploadBrand', {
          method: 'POST',
          body: fd,
        })
        const data = await res.json()
        if (!res.ok || !data?.url) throw new Error('Gagal mengunggah gambar')
        form.setValue('imageUrl', data.url, { shouldDirty: true })
        toast.success('Gambar berhasil diunggah')
      } catch (err: any) {
        toast.error(err?.message || 'Upload gagal')
      } finally {
        setIsUploading(false)
        setFiles(null)
      }
    })()
  }, [files, form])
  return (
    <div className={cn('')}>
      <Header>
        <h2 className={cn('text-secondary-foreground/80')}>Dashboard Admin</h2>
      </Header>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 max-w-3xl mx-auto py-10'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder='shadcn' type='text' {...field} />
                </FormControl>
                <FormDescription>Nama lengkap</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='userName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Divisi</FormLabel>
                <FormControl>
                  <Input placeholder='shadcn' type='text' {...field} />
                </FormControl>
                <FormDescription>Nama divisi pemilik akun</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl>
                  <Input placeholder='123456789101112' type='text' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='taxId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>NPWP</FormLabel>
                <FormControl>
                  <Input placeholder='shadcn' type='text' {...field} />
                </FormControl>
                <FormDescription>Masukan NPWP</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto Profil</FormLabel>
                <FormControl>
                  <div className='space-y-3'>
                    <FileUploader
                      value={files}
                      className='relative bg-background rounded-lg p-2'
                      onValueChange={setFiles}
                      dropzoneOptions={{
                        multiple: false,
                        maxFiles: 1,
                        maxSize: 4 * 1024 * 1024,
                        accept: {
                          'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
                        },
                      }}>
                      <FileInput
                        id='fileInput'
                        className='outline-dashed outline-1 outline-slate-500'>
                        <div className='flex items-center justify-center flex-col p-8 w-full '>
                          <CloudUpload className='text-gray-500 w-10 h-10' />
                          <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
                            <span className='font-semibold'>
                              Click to upload
                            </span>
                            &nbsp; or drag and drop
                          </p>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            SVG, PNG, JPG or GIF (Max 4MB each)
                          </p>
                        </div>
                      </FileInput>
                      <FileUploaderContent className='mt-2'>
                        {files?.map((file, index) => (
                          <FileUploaderItem key={index} index={index}>
                            <span className='truncate max-w-[20ch]'>
                              {file.name}
                            </span>
                          </FileUploaderItem>
                        ))}
                      </FileUploaderContent>
                    </FileUploader>

                    {(field.value || isUploading) && (
                      <div className='flex items-center gap-3'>
                        <div className='size-12 rounded-md overflow-hidden border bg-muted'>
                          {field.value ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={field.value}
                              alt='preview'
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center text-xs text-muted-foreground'>
                              Uploading...
                            </div>
                          )}
                        </div>
                        {field.value ? (
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => field.onChange('')}
                            disabled={isUploading}>
                            Hapus
                          </Button>
                        ) : null}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end gap-2'>
            <Link href='/dashboard/profile-admin'>
              <Button size='lg' variant={'outline'}>
                Batal
              </Button>
            </Link>
            <Button
              type='submit'
              size='lg'
              disabled={mutation.isPending}
              className={cn(mutation.isPending && 'cursor-not-allowed')}>
              {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
export default EditProfileAdmin
