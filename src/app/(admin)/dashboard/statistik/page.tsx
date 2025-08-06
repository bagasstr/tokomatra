'use client'

import DashboardCard from '@/components/admin/dashboardCard'
import { Bar } from 'react-chartjs-2'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card'
import Header from '@/components/ui/header'
import { cn } from '@/lib/utils'
import {
  Download,
  Package,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react'
import WeeklySalesReport from '@/components/admin/weeklySalesReport'

function StatistikPage() {
  return (
    <div className={cn('py-6')}>
      <Header>
        <h2 className={cn('text-secondary-foreground/80')}>Statistik</h2>
        <Button size='lg' variant='outline'>
          <Download className='w-4 h-4' />
          Export Statistik
        </Button>
      </Header>

      <div
        className={cn(
          'grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-5 gap-4 mb-6'
        )}>
        <DashboardCard
          title='Pesanan Baru'
          value='100'
          info='Dalam 7 hari terakhir'
          icon={<ShoppingCart className='w-4 h-4' />}
        />
        <DashboardCard
          title='Total Pelanggan'
          value='100'
          info='Jumlah pelanggan terdaftar'
          icon={<Users className='w-4 h-4' />}
        />
        <DashboardCard
          title='Total Produk'
          value='100'
          info='Jumlah produk'
          icon={<ShoppingBag className='w-4 h-4' />}
        />
        <DashboardCard
          title='Produk Stok Terendah'
          value='100'
          info='Produk dengan stok terendah'
          icon={<Package className='w-4 h-4' />}
        />
        <DashboardCard
          title='Produk Terlaris'
          value='tidak ada'
          info='Produk terlaris bulan ini'
          icon={<TrendingUp className='w-4 h-4' />}
        />
      </div>
      <div className='grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklySalesReport />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent className='flex items-center justify-between gap-4'>
            <div>
              <h5>Bata ringan</h5>
              <p className='text-sm text-muted-foreground'>Terjual: 300pcs</p>
            </div>
            <div>
              <h5>Rp. 10.000</h5>
              <p className='text-sm text-muted-foreground'>Stok: 100pcs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StatistikPage
