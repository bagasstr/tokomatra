'use client'

import { authClient } from '@/lib/authClient'
import { cn } from '@/lib/utils'
import { resetPasswordSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { useState } from 'react'

const ResetPassword = () => {
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  })
  const onSubmit = async (formData: z.infer<typeof resetPasswordSchema>) => {
    setLoading(true)
    const { data, error } = await authClient.requestPasswordReset({
      email: formData.email,
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/request-reset-password/reset-password/`,
    })
    if (error) {
      toast.error(error.message)
    }
    if (data) {
      toast.success('Email reset password berhasil dikirim')
    }
    setLoading(false)
  }
  return (
    <div className='py-10 mobile:w-[60%] tablet:w-[50%] mx-auto desktop:w-[40%]'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email' type='email' {...field} />
                </FormControl>
                <FormDescription>
                  Masukkan email Anda untuk mendapatkan link reset password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={loading}>
            {loading ? 'Mengirim...' : 'Kirim'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
export default ResetPassword
