import BestSellingDashboard from '@/components/admin/bestSellingDashboard'
import DashboardCard from '@/components/admin/dashboardCard'
import RecentOrderDashboard from '@/components/admin/recentOrderDashboard'
import SalesChartDashboard from '@/components/admin/salesChartDashboard'
import Header from '@/components/ui/header'
import { cn } from '@/lib/utils'
import { Package, ShoppingCart, Star, UserCheck } from 'lucide-react'

const DashboardPage = async () => {
  return (
    <div className={cn('py-6 min-h-screen')}>
      <Header>
        <h2 className={cn('text-secondary-foreground/80')}>Dashboard Admin</h2>
        <p className='text-gray-600'>
          {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </Header>
      <div className={cn('mb-6 grid grid-cols-1 desktop:grid-cols-4 gap-4')}>
        <DashboardCard
          title='Pesanan Baru'
          value={'0'}
          icon={<ShoppingCart className='h-5 w-5' />}
          info='7 hari terakhir'
          iconBg='bg-green-100 text-green-600'
        />
        <DashboardCard
          title='Pelanggan'
          value={'0'}
          icon={<UserCheck className='h-5 w-5' />}
          info='total pelanggan'
          iconBg='bg-yellow-100 text-yellow-600'
        />
        <DashboardCard
          title='Stok Rendah'
          value={`${'0'} Produk`}
          icon={<Package className='h-5 w-5' />}
          info='perlu restock'
          iconBg='bg-red-100 text-red-600'
        />
        <DashboardCard
          title='Produk Terlaris'
          value={'Tidak ada'}
          icon={<Star className='h-5 w-5' />}
          info='bulan ini'
          iconBg='bg-purple-100 text-purple-600'
        />
      </div>
      <div className='grid grid-cols-1 desktop:grid-cols-2 gap-4 mb-6'>
        <SalesChartDashboard />
        <BestSellingDashboard data={[]} />
      </div>
      <div className=''>
        <RecentOrderDashboard />
      </div>
    </div>
  )
}
export default DashboardPage
