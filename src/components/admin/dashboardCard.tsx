'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSidebar } from '../ui/sidebar'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
  title: string
  value: string
  icon: React.ReactNode
  info?: string
  infoColor?: string
  iconBg?: string // opsional, untuk warna background icon
}

const DashboardCard = ({
  title,
  value,
  icon,
  info,
  iconBg = 'bg-primary/10 text-primary', // default biru
  infoColor = 'text-gray-600',
}: DashboardCardProps) => {
  const { open } = useSidebar()
  return (
    <Card className=''>
      <CardHeader className='flex flex-row items-start justify-between pb-2'>
        <CardTitle>
          <p className='text-foreground/80 text-sm'>{title}</p>
        </CardTitle>
        <div
          className={`rounded-full p-2 ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <h2>{value}</h2>
        {info && <p className={`text-xs ${infoColor} mt-1`}>{info}</p>}
      </CardContent>
    </Card>
  )
}

export default DashboardCard
