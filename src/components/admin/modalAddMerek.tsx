'use client'

import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { CloudUpload, Image, Plus, X } from 'lucide-react'
import { Input } from '../ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload'

const modalAddBrandSchema = z.object({
  name: z.string().min(1),
  logo: z.string().optional(),
})
const ModalAddMerek = () => {
  const [files, setFiles] = useState<File[] | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  }

  const form = useForm<z.infer<typeof modalAddBrandSchema>>({
    resolver: zodResolver(modalAddBrandSchema),
    defaultValues: {
      name: '',
      logo: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof modalAddBrandSchema>) => {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.error || 'Gagal menambahkan merek')
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success('Merek berhasil ditambahkan')
      setIsOpen(false)
      form.reset({ name: '', logo: '' })
      setFiles(null)
    },
    onError: (error) => {
      toast.error(error?.message || 'Gagal menambahkan merek')
    },
  })

  const uploadLogo = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/uploadBrand', {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || 'Gagal mengunggah logo')
    }
    const data: { url?: string; imageUrl?: string } = await response.json()
    return 'url' in data ? data.url! : data.imageUrl!
  }

  const onSubmit = async (values: z.infer<typeof modalAddBrandSchema>) => {
    try {
      setIsUploading(true)

      let logoUrl: string | undefined
      if (files && files.length > 0) logoUrl = await uploadLogo(files[0])

      await mutation.mutateAsync({ name: values.name, logo: logoUrl })
    } catch (error: any) {
      toast.error(error?.message || 'Gagal menambahkan merek')
    } finally {
      setIsUploading(false)
    }
  }
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button size='lg' onClick={() => setIsOpen(true)}>
          <Plus className='w-4 h-4' />
          Tambah Merek
        </Button>
        <DialogContent className={cn('max-w-md')}>
          <DialogHeader>
            <DialogTitle>Tambah Merek</DialogTitle>
          </DialogHeader>
          <div className={cn('')}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('space-y-8')}>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Merek</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={files}
                      onValueChange={setFiles}
                      dropzoneOptions={dropZoneConfig}
                      className='relative bg-background rounded-lg p-2'>
                      <FileInput className='outline-dashed outline-1 outline-slate-500'>
                        <div className='flex items-center justify-center flex-col p-8 w-full'>
                          <CloudUpload className='text-gray-500 w-10 h-10' />
                          <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
                            <span className='font-semibold'>
                              Click to upload
                            </span>
                            &nbsp; or drag and drop
                          </p>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            PNG atau JPG (Maksimal 4MB)
                          </p>
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        {files &&
                          files.length > 0 &&
                          files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Image className='h-4 w-4 stroke-current' />
                              <span>{file.name}</span>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </FormControl>
                </FormItem>
                <div className={cn('flex justify-end gap-2 mt-4')}>
                  <Button
                    type='submit'
                    disabled={mutation.isPending || isUploading}>
                    {mutation.isPending || isUploading
                      ? 'Menambahkan...'
                      : 'Tambah Merek'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default ModalAddMerek
