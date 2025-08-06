'use client'

import { Profile } from '@/lib/type'
import { cn } from '@/lib/utils'
import { editProfileSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { queryClient } from '@/lib/queryClient'
import EditProfileLoading from './editProfileLoading'

const EditProfilPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = searchParams.get('user')

  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery<Profile>({
    queryKey: ['profile', pathname?.toString()],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/${pathname}`
      )
      const data = await response.json()
      return data
    },
    enabled: !!pathname?.toString(),
  })

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: '',
      userName: '',
      phoneNumber: '',
      gender: undefined,
      dateOfBirth: '',
      bio: '',
      companyName: '',
      taxId: '',
      imageUrl: '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (profileData?.data) {
      form.reset({
        fullName: profileData.data.fullName || '',
        userName: profileData.data.userName || '',
        phoneNumber: profileData.data.phoneNumber || '',
        gender: profileData.data.gender as 'male' | 'female' | 'other',
        dateOfBirth: profileData.data.dateOfBirth || '',
        bio: profileData.data.bio || '',
        companyName: profileData.data.companyName || '',
        taxId: profileData.data.taxId || '',
        imageUrl: profileData.data.imageUrl || '',
      })
      setPreviewImage(profileData.data.imageUrl || null)
    }
  }, [profileData, form])

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof editProfileSchema>) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/${pathname}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw {
          response: { data: result },
          status: response.status,
        }
      }

      return result
    },
    onMutate: (data) => {
      queryClient.setQueryData(['profile'], (oldData: Profile) => {
        return {
          ...oldData,
          data: {
            ...oldData.data,
            ...data,
          },
        }
      })
    },
    onSuccess: () => {
      toast.success('Profile berhasil diubah')
      queryClient.invalidateQueries({
        queryKey: ['banner-profile'],
      })
      router.push(`/profil?user=${pathname}`)
    },
    onError: (error: any) => {
      // Handle specific error messages from API
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error?.message) {
        toast.error(error.message)
      } else {
        toast.error('Profile gagal diubah')
      }
    },
  })
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
        form.setValue('imageUrl', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: z.infer<typeof editProfileSchema>) => {
    mutation.mutate(data)
  }

  if (isLoading) return <EditProfileLoading />
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pr-4'>
        <div className='flex flex-col items-center h-full gap-4'>
          <div className='relative'>
            <Avatar className='h-24 w-24'>
              <AvatarImage src={previewImage || profileData?.data?.imageUrl} />
              <AvatarFallback>
                {profileData?.data?.fullName || 'U'}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor='avatar-upload'
              className='absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-2 text-primary-foreground hover:bg-primary/90'>
              <Camera className='h-4 w-4' />
              <input
                id='avatar-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className='text-sm text-muted-foreground'>
            Klik ikon kamera untuk mengubah foto profil
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder='Masukkan nama lengkap' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='userName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='Masukkan username' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl>
                  <Input placeholder='Masukkan nomor telepon' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='gender'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih jenis kelamin' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='male'>Laki-laki</SelectItem>
                    <SelectItem value='female'>Perempuan</SelectItem>
                    <SelectItem value='other'>Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='dateOfBirth'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Lahir</FormLabel>
              <FormControl>
                <Input type='date' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Ceritakan sedikit tentang diri Anda'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-4 rounded-lg border p-4'>
          <h3 className='font-medium'>Informasi Bisnis (Opsional)</h3>
          <div className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='companyName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Perusahaan</FormLabel>
                  <FormControl>
                    <Input placeholder='Masukkan nama perusahaan' {...field} />
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
                    <Input placeholder='Masukkan nomor NPWP' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type='submit' className='w-full' disabled={mutation.isPending}>
          {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
        <Button
          variant={'outline'}
          type='button'
          className='w-full'
          onClick={() => router.back()}>
          Kembali
        </Button>
      </form>
    </Form>
  )
}
export default EditProfilPage
