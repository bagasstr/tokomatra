'use server'

import { prisma } from '@/lib/prisma'
import { Notification } from '@/lib/type'
import { randomUUID } from 'crypto'
import Error from 'next/error'

export const sendNotification = async ({
  type,
  name,
  message,
  email,
}: {
  type: string
  name: string
  message: string
  email: string | null
}) => {
  try {
    await prisma.$transaction(async (ctx) => {
      const existing = await ctx.notifications.findFirst({
        where: {
          email: email,
          title: 'Login',
          message: 'Login berhasil',
        },
      })

      if (existing && existing.isRead === true) {
        await ctx.notifications.update({
          where: { id_notification: existing.id_notification },
          data: {
            isRead: false,
            createdAt: new Date(),
          },
        })
        return { success: true }
      } else if (!existing) {
        await ctx.notifications.create({
          data: {
            id_notification: randomUUID(),
            email: email,
            title: type,
            message: message,
            isRead: false,
            createdAt: new Date(),
          },
        })
        return { success: true }
      }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Failed to create notification:', error)
    return { success: false, error: error.message }
  }
}

export const getNotification = async (id: string) => {
  try {
    const notification = await prisma.notifications.findMany({
      where: {
        email: id,
      },
      select: {
        id_notification: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return notification
  } catch (error: any) {
    console.error('Failed to get notification:', error)
    return { success: false, error: error.message }
  }
}

export const getNotificationCount = async (email: string) => {
  try {
    const notification = await prisma.notifications.count({
      where: {
        email: email,
        isRead: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return notification
  } catch (error: any) {
    console.error('Failed to get notification count:', error)
    return { success: false, error: error.message }
  }
}

export const readNotification = async (id: string) => {
  try {
    await prisma.notifications.update({
      where: { id_notification: id },
      data: { isRead: true },
    })
  } catch (error: any) {
    console.error('Failed to read notification:', error)
    return { success: false, error: error.message }
  }
}

export const deleteNotification = async (id: string) => {
  await prisma.notifications.deleteMany({
    where: { email: id, title: 'Login', message: 'Login berhasil' },
  })
}
