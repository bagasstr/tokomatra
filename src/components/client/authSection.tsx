'use client'

import { cn } from '@/lib/utils'
import { ArrowRight, LogIn, UserPlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '../ui/button'

const AuthSection = () => {
  return (
    <div className={cn('')}>
      <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'>
        {/* Header with background */}
        <div className='bg-gradient-to-b from-blue-500 to-blue-800 p-6 text-white text-center relative'>
          <div className='relative z-10'>
            <div className='flex justify-center mb-4'>
              <Image
                src='/Logo_white.png'
                alt='Logo'
                width={160}
                height={50}
                className='h-auto'
              />
            </div>
            <h1 className='text-2xl font-bold mb-2'>Selamat Datang</h1>
            <p className='text-blue-100'>
              Silakan masuk untuk melanjutkan belanja
            </p>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 md:p-8'>
          <div className='space-y-6'>
            <div className='flex flex-col gap-2'>
              <Suspense
                fallback={
                  <div className='w-full py-3 bg-gray-200 text-gray-500 rounded-lg font-semibold text-center'>
                    Loading...
                  </div>
                }>
                <Link href='/login' className='w-full'>
                  <Button className='w-full py-3.5 bg-blue-600 text-white rounded-lg font-semibold text-base hover:bg-blue-700 transition-all duration-200 flex items-center justify-center group'>
                    <LogIn className='mr-2 h-5 w-5' />
                    Masuk
                    <ArrowRight className='ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform' />
                  </Button>
                </Link>
              </Suspense>

              <Link href='/daftar' className='w-full'>
                <Button className='w-full py-3.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold text-base hover:bg-gray-50 transition-all duration-200 flex items-center justify-center group'>
                  <UserPlus className='mr-2 h-5 w-5 text-gray-600' />
                  Daftar Akun Baru
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='px-6 py-4 bg-gray-50 text-center border-t border-gray-100'>
          <p className='text-xs text-gray-500'>
            Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan serta
            Kebijakan Privasi kami
          </p>
        </div>
      </div>
    </div>
  )
}
export default AuthSection
