'use client'

import { cn } from '@/lib/utils'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Card, CardTitle, CardHeader, CardContent } from '../ui/card'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const SalesChartDashboard = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value)
          },
        },
      },
    },
  }
  const data = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Sales',
        data: [
          12000, 15000, 18000, 20000, 22000, 25000, 28000, 30000, 32000, 35000,
          38000, 40000,
        ],
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.4,
      },
    ],
  }
  return (
    <Card className={cn('')}>
      <CardHeader className=''>
        <CardTitle>Grafik Penjualan</CardTitle>
      </CardHeader>
      <CardContent>
        <Line options={options} data={data} />
      </CardContent>
    </Card>
  )
}
export default SalesChartDashboard
