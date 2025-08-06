'use client'

import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import Link from 'next/link'
import { loginSchema } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { authClient, signIn } from '@/lib/authClient'
import { useState } from 'react'
import { sendNotification } from '@/app/actions/notification'
import { queryClient } from '@/lib/queryClient'

const LoginSection = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)
      const parsedData = Object.fromEntries(formData)
      const parseData = loginSchema.safeParse(parsedData)
      if (parseData.success) {
        const { error } = await signIn.email(
          {
            email: values.email,
            password: values.password,
          },
          {
            onRequest: () => {
              setLoading(true)
            },
            onSuccess: async () => {
              toast.success('Login berhasil')
              await sendNotification({
                type: 'Login',
                name: 'Login',
                message: 'Login berhasil',
                email: values.email,
              })
              await queryClient.invalidateQueries({
                queryKey: ['notificationCount'],
              })
              await queryClient.invalidateQueries({
                queryKey: ['notification'],
              })
              router.push('/')
            },
          }
        )
        if (error) {
          toast.error(
            error.message?.includes('Invalid email or password')
              ? 'Email atau password salah'
              : error.message
          )
          setLoading(false)
        }
      }
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Failed to submit the form. Please try again.')
    }
  }

  return (
    <div className='py-10 mobile:w-[60%] tablet:w-[50%] mx-auto desktop:w-[40%]'>
      <h1 className='text-center mb-5'>Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='john@example.com'
                    type='email'
                    {...field}
                  />
                </FormControl>
                <FormDescription>Masukan email anda</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder='********' type='password' {...field} />
                </FormControl>
                <FormDescription>Masukan password anda</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Login...' : 'Login'}
          </Button>
        </form>
      </Form>
      <div className='flex items-center flex-col justify-center gap-x-2 mt-4'>
        <p>
          Lupa password?{' '}
          <Link href='/request-reset-password' className='text-primary'>
            Reset password
          </Link>
        </p>
        <p>
          Belum punya akun?{' '}
          <Link href='/registrasi' className='text-primary'>
            Daftar
          </Link>
        </p>
      </div>
    </div>
  )
}
export default LoginSection
