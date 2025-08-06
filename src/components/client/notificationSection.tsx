'use client'

import { cn } from '@/lib/utils'
import { Notification } from '@/lib/type'
import { useState } from 'react'
import { Button } from '../ui/button'
import { getNotification, readNotification } from '@/app/actions/notification'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from '@/lib/authClient'
import { queryClient } from '@/lib/queryClient'

const NotificationSection = () => {
  const { data: session } = useSession()
  const readNotif = async (id: string) => {
    await readNotification(id)
    queryClient.invalidateQueries({
      queryKey: ['notificationCount'],
    })
    queryClient.invalidateQueries({
      queryKey: ['notification'],
    })
  }
  const { data: notification } = useQuery<Notification[]>({
    queryKey: ['notification'],
    queryFn: async () => {
      const data = await getNotification(session?.user.email as string)
      return data as Notification[]
    },
    enabled: !!session,
  })
  return (
    <div className={cn('')}>
      <h2>Notifikasi</h2>
      <div className='mt-10'>
        {notification?.map((item: Notification) => (
          <div
            onClick={() => readNotif(item.id_notification || '')}
            key={item.id_notification}
            className={cn(
              'flex items-center justify-between p-4 rounded-lg border border-gray-200',
              item.isRead ? 'bg-gray-100 text-gray-500' : 'bg-white'
            )}>
            <div className='flex items-center gap-4'>
              <h3>{item.title}</h3>
              <p>{item.message}</p>
            </div>
            <p>{item.createdAt?.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default NotificationSection
