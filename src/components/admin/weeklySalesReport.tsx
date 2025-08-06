'use client'

import { cn } from '@/lib/utils'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}
const data = {
  labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
  datasets: [
    {
      type: 'bar' as const,
      label: 'Penjualan Mingguan',
      data: [12, 19, 3, 5, 2, 3, 20, 15, 10, 8, 5, 10],
      backgroundColor: 'oklch(0.36 0.19 275)',
    },
  ],
}

const WeeklySalesReport = () => {
  return <Bar data={data || {}} options={options} />
}
export default WeeklySalesReport
