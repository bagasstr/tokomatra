'use client'
import { useEffect, useState, useRef } from 'react'
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { authClient, useSession } from '@/lib/authClient'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { sendNotification } from '@/app/actions/notification'
import { queryClient } from '@/lib/queryClient'

const formSchema = z.object({
  otp: z.string(),
})

const RESEND_COOLDOWN = 30 // seconds

const VerificationSection = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const { data: session } = useSession()
  const [otpExpired, setOtpExpired] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const cooldownRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Reset expired state every 500ms (original logic)
    const interval = setInterval(() => {
      setOtpExpired(false)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Set cooldown saat halaman dibuka
  useEffect(() => {
    setCooldown(RESEND_COOLDOWN)
  }, [])

  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setTimeout(() => {
        setCooldown(cooldown - 1)
      }, 1000)
    }
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current)
    }
  }, [cooldown])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email: session?.user?.email as string,
        otp: values.otp,
      })
      if (data) {
        toast.success('Email berhasil terverifikasi')
        await sendNotification({
          type: 'Login',
          name: 'Login',
          message: 'Login berhasil',
          email: session?.user?.email as string,
        })
        await queryClient.invalidateQueries({
          queryKey: ['notificationCount'],
        })
        await queryClient.invalidateQueries({
          queryKey: ['notification'],
        })
        router.push('/')
      }
      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  async function resendOtp() {
    if (cooldown > 0) return
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: session?.user?.email as string,
        type: 'email-verification',
      })
      toast.success('Kode OTP berhasil dikirim ulang')
      setOtpExpired(false)
      setCooldown(RESEND_COOLDOWN)
    } catch (error) {
      toast.error('Gagal mengirim ulang kode OTP. Silakan coba lagi.')
    }
  }

  return (
    <div className=''>
      <div className='text-xl font-semibold text-gray-800 mb-2 text-center'>
        Verifikasi Email
      </div>
      <div className='text-sm text-gray-600 text-center mb-4'>
        Masukkan kode OTP yang telah dikirim ke {session?.user?.email}
      </div>

      {otpExpired && (
        <div className='text-red-500 text-center mb-4'>
          Kode OTP sudah kedaluwarsa. Silakan minta kode baru.
        </div>
      )}
      <div className='flex justify-center '>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 max-w-3xl mx-auto'>
            <FormField
              control={form.control}
              name='otp'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='justify-center mb-5 text-lg font-semibold'>
                    Kode OTP
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>Masukan kode OTP</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full'>
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <div className='flex justify-center mt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={resendOtp}
          disabled={cooldown > 0}>
          {cooldown > 0 ? `Kirim ulang OTP (${cooldown}s)` : 'Kirim ulang OTP'}
        </Button>
      </div>
    </div>
  )
}

export default VerificationSection
