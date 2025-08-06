'use client'

import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'

interface FaqItem {
  question: string
  answer: string | React.ReactNode
}

const faqs: FaqItem[] = [
  {
    question: 'Bagaimana cara memesan produk?',
    answer:
      'Pilih produk yang diinginkan, klik tombol beli, lalu ikuti proses checkout hingga selesai.',
  },
  {
    question: 'Bagaimana cara pembayaran?',
    answer:
      'Kami menerima pembayaran melalui transfer bank, e-wallet, dan metode pembayaran online lainnya.',
  },
  {
    question: 'Apa itu sistem Supply on Demand?',
    answer: (
      <div>
        Sistem <b>Supply on Demand</b> adalah metode pemesanan di mana produk
        akan dipesan langsung ke supplier setelah Anda melakukan pemesanan. Hal
        ini memungkinkan kami menyediakan lebih banyak pilihan produk, meskipun
        stok tidak selalu tersedia di gudang kami. Estimasi waktu pengiriman
        akan diinformasikan setelah konfirmasi dari supplier.
      </div>
    ),
  },
  {
    question: 'Apakah pengiriman menjangkau seluruh Indonesia?',
    answer: <div>Saat ini kami hanya menjangkau Pulau Jawa.</div>,
  },
  {
    question: 'Bagaimana saya tahu produk ready stock atau indent?',
    answer: (
      <div>
        Keterangan stok tersedia di halaman produk. Jika ragu, Anda akan
        dikonfirmasi kembali oleh tim kami melalui WhatsApp setelah pemesanan.
      </div>
    ),
  },
  {
    question: 'Berapa lama waktu pengiriman?',
    answer: (
      <div>
        <ul className='list-disc pl-5'>
          <li>
            <b>Jabodetabek:</b> 1-2 hari kerja (ready stock)
          </li>
          <li>
            <b>Luar Jabodetabek (Pulau Jawa):</b> 2-5 hari kerja
          </li>
          <li>
            <b>Luar Pulau Jawa:</b> mengikuti estimasi supplier
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: 'Apa saja metode pembayaran yang tersedia?',
    answer: (
      <div>
        Kami menerima pembayaran sesuai dengan metode pembayaran yang tersedia
        di halaman pembayaran.
      </div>
    ),
  },
  {
    question: 'Apakah bisa COD (Bayar di Tempat)?',
    answer: <div>Saat ini kami belum mendukung sistem pembayaran COD.</div>,
  },
  {
    question: 'Apakah produk bisa dikembalikan?',
    answer: (
      <div>
        Pengembalian hanya berlaku untuk produk yang rusak saat pengiriman atau
        tidak sesuai dengan pesanan. Laporan maksimal 2x24 jam setelah barang
        diterima.
      </div>
    ),
  },
]

const FaqSection = () => {
  return (
    <div className={cn('')}>
      <div className={cn('flex flex-col items-center')}>
        <h2>FAQ</h2>
        <p className={cn('text-center text-muted-foreground')}>
          Temukan jawaban atas pertanyaan-pertanyaan umum tentang layanan kami.
        </p>
      </div>
      <Accordion type='single' collapsible className='mt-10'>
        {faqs.map((faq, index) => (
          <AccordionItem
            value={`item-${index}`}
            key={index}
            className='border-none space-y-4'>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
export default FaqSection
