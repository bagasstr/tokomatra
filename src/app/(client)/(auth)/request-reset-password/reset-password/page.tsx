'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/authClient'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const ResetPasswordPage = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  if (!token) {
    toast.error('Token tidak ditemukan')
  }

  const resetPasswordForm = z.object({
    newPassword: z.string().min(1, 'Password wajib diisi'),
  })

  const form = useForm<z.infer<typeof resetPasswordForm>>({
    resolver: zodResolver(resetPasswordForm),
    defaultValues: {
      newPassword: '',
    },
  })

  const onSubmit = async (formData: z.infer<typeof resetPasswordForm>) => {
    setLoading(true)
    const { data, error } = await authClient.resetPassword({
      newPassword: formData.newPassword, // required
      token: token as string, // required
    })
    if (error) {
      toast.error(error.message)
    }
    if (data) {
      toast.success('Password berhasil direset')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div
      className={cn(
        'py-10 mobile:w-[60%] tablet:w-[50%] mx-auto desktop:w-[40%]'
      )}>
      <h1 className='text-center mb-8'>Reset Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormDescription>
                  Masukkan password baru Anda untuk reset password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Reset...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
export default ResetPasswordPage
