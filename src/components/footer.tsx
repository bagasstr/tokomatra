'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className={cn('bg-gray-900 py-10 mt-10')}>
      <div className={cn('container')}>
        <div className={cn('flex flex-col gap-y-4 mb-4')}>
          <div className={cn('flex items-center gap-x-2')}>
            <div className={cn('relative w-11 h-11')}>
              <Image
                src={'/matrakosala.svg'}
                alt='logo'
                fill
                className='object-contain'
              />
            </div>
            <h1 className={cn('text-primary-foreground')}>Toko Matra</h1>
          </div>
          <p className={cn('text-primary-foreground/90')}>
            Toko bahan bangunan online, solusi lengkap kebutuhan konstruksi dan
            renovasi Anda.
          </p>
        </div>
        <div
          className={cn(
            'grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-4 mt-10'
          )}>
          <div className={cn('flex flex-col gap-y-2')}>
            <h3 className={cn('text-primary-foreground')}>Navigasi</h3>
            <ul className={cn('flex flex-col gap-y-2')}>
              <li className={cn('text-primary-foreground/90')}>
                <Link href='/'>Beranda</Link>
              </li>
              <li className={cn('text-primary-foreground/90')}>
                <Link href='/kategori'>Kategori</Link>
              </li>
              <li className={cn('text-primary-foreground/90')}>
                <Link href='/tentang-kami'>Tentang Kami</Link>
              </li>
              <li className={cn('text-primary-foreground/90')}>
                <Link href='/faq'>FAQ</Link>
              </li>
              <li className={cn('text-primary-foreground/90')}>
                <Link href='/kontak-kami'>Kontak Kami</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={cn('mt-10')}>
          <div className={cn('flex flex-col gap-y-2')}>
            <h3 className={cn('text-primary-foreground')}>Informasi</h3>
            <ul className={cn('flex flex-col gap-y-2')}>
              <li className={cn('text-primary-foreground/90')}>
                Jl. Raya Kb. Jeruk No.10 4, Kb. Jeruk, Kota Jakarta Barat
              </li>
              <li className={cn('text-primary-foreground/90')}>
                Email:{' '}
                <Link
                  href='mailto:matrakosala@gmail.com'
                  className={cn('underline')}>
                  matrakosala@gmail.com
                </Link>
              </li>
              <li className={cn('text-primary-foreground/90')}>
                WhatsApp:{' '}
                <Link href='wa.me/6285697093044' className={cn('underline')}>
                  0856-9709-3044
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={cn('mt-10')}>
          <div className={cn('flex flex-col gap-y-2')}>
            <h3 className={cn('text-primary-foreground')}>Social Media</h3>
            <ul className={cn('flex flex-col gap-y-2')}>
              <li className={cn('text-primary-foreground/90')}>
                <Link href='https://www.instagram.com/matrakosala'>
                  Instagram
                </Link>
              </li>
              <li className={cn('text-primary-foreground/90')}>
                <Link href='https://www.facebook.com/matrakosala'>
                  Facebook
                </Link>
              </li>
              <li className={cn('text-primary-foreground/90')}>
                <Link href='https://www.tiktok.com/@matrakosala'>TikTok</Link>
              </li>
              <li className={cn('text-primary-foreground/90')}>
                <Link href='https://www.youtube.com/@matrakosala'>YouTube</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Footer
