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
import { signIn, useSession } from '@/lib/authClient'
import { adminLoginSchema } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

const LoginAdminPage = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const { data: session } = useSession()
  console.log(session)
  useEffect(() => {
    if (
      session?.user.role === 'SUPER_ADMIN' ||
      session?.user.role === 'ADMIN'
    ) {
      router.push('/dashboard')
    }
  }, [session, router])

  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof adminLoginSchema>) => {
    try {
      setLoading(true)
      const { error } = await signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: async () => {
            toast.success('Login berhasil')
            router.push('/dashboard')
          },
        }
      )

      if (error) {
        toast.error(
          error.message?.includes('Invalid email or password')
            ? 'Email atau password salah'
            : error.message
        )
      }
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Gagal mengirim formulir. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <div
        className={cn(
          'py-10 mobile:w-[60%] tablet:w-[50%] mx-auto desktop:w-[30%] border p-4 rounded-lg'
        )}>
        <div className='flex justify-center items-center'>
          <div className='w-full'>
            <h1 className='text-2xl font-bold mb-2 mt-4 text-center'>
              Login Admin
            </h1>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 max-w-3xl mx-auto py-10'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='admin@matrakosala.com'
                      type='email'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Masukan email admin</FormDescription>
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
                    <div className='relative'>
                      <Input
                        placeholder='********'
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        className='pr-10'
                      />
                      <button
                        type='button'
                        onClick={togglePasswordVisibility}
                        className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-600'>
                        {showPassword ? (
                          <EyeOff className='h-5 w-5' />
                        ) : (
                          <Eye className='h-5 w-5' />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormDescription>Masukan password admin</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Tunggu...' : 'Login'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default LoginAdminPage
