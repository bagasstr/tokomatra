'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
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
import { registerSchema } from '@/lib/validation'
import Link from 'next/link'
import { authClient, signUp } from '@/lib/authClient'
import { useRouter } from 'next/navigation'
import { isEmailVerified } from '@/lib/authClient'
import { useMutation } from '@tanstack/react-query'

const RegisterSection = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  })
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof registerSchema>) => {
      const response = await fetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      return response.json()
    },
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)
      formData.append('fullName', values.fullName)
      formData.append('confirm_password', values.confirm_password)
      const parsedData = Object.fromEntries(formData)
      const parseData = registerSchema.safeParse(parsedData)
      if (!parseData.success) {
        toast.error('Data tidak valid')
        return
      }

      await signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.fullName,
        },
        {
          onRequest: () => {
            setLoading(true)
          },
          onSuccess: async () => {
            await authClient.emailOtp.sendVerificationOtp({
              email: values.email,
              type: 'email-verification',
            })
            mutation.mutate(values)
            toast.success('Registrasi berhasil silahkan verifikasi email anda')
            router.push(`/verification`)
            setLoading(false)
          },
          onError: async (ctx: any) => {
            const error = ctx.error.message
            if (error.includes('User already exists')) {
              const verified = await isEmailVerified(values.email)
              if (!verified) {
                toast.error(
                  'Email belum diverifikasi, silakan verifikasi email Anda'
                )
                router.push('/verification')
              } else {
                toast.error('Email sudah terdaftar')
              }
            } else {
              toast.error(error)
            }
            setLoading(false)
          },
        }
      )
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Failed to submit the form. Please try again.')
    }
  }
  return (
    <div className='py-10 mobile:w-[60%] tablet:w-[50%] mx-auto desktop:w-[40%]'>
      <h1 className='text-center mb-5'>Registrasi</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder='john doe' type='text' {...field} />
                </FormControl>
                <FormDescription>Masukan nama lengkap anda</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  <Input placeholder='********' type='text' {...field} />
                </FormControl>
                <FormDescription>Masukan password anda</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirm_password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konfirmasi Password</FormLabel>
                <FormControl>
                  <Input placeholder='********' type='text' {...field} />
                </FormControl>
                <FormDescription>
                  Masukan password anda sekali lagi
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar'}
          </Button>
        </form>
      </Form>
      <div className='flex items-center flex-col justify-center gap-x-2 mt-4'>
        <p>
          Sudah punya akun?{' '}
          <Link href='/login' className='text-primary'>
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
export default RegisterSection
