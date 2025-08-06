import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = await params
  const profile = await prisma.profile.findUnique({
    where: { userId: id },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  })
  if (!profile) {
    return NextResponse.json(
      {
        success: false,
        message: 'Profile not found',
      },
      { status: 404 }
    )
  }
  return NextResponse.json(
    {
      success: true,
      data: profile,
    },
    { status: 200 }
  )
}

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: id },
    })

    if (!existingProfile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found' },
        { status: 404 }
      )
    }

    // Check for duplicate phone number if phoneNumber is being updated
    if (body.phoneNumber && body.phoneNumber !== existingProfile.phoneNumber) {
      const duplicatePhone = await prisma.profile.findFirst({
        where: {
          phoneNumber: body.phoneNumber,
          userId: { not: id }, // Exclude current user
        },
      })

      if (duplicatePhone) {
        return NextResponse.json(
          {
            success: false,
            message: 'Nomor telepon sudah digunakan oleh user lain',
          },
          { status: 400 }
        )
      }
    }

    // Check for duplicate username if userName is being updated
    if (body.userName && body.userName !== existingProfile.userName) {
      const duplicateUsername = await prisma.profile.findFirst({
        where: {
          userName: body.userName,
          userId: { not: id }, // Exclude current user
        },
      })

      if (duplicateUsername) {
        return NextResponse.json(
          {
            success: false,
            message: 'Username sudah digunakan oleh user lain',
          },
          { status: 400 }
        )
      }
    }

    const profile = await prisma.profile.update({
      where: { userId: id },
      data: body,
    })

    return NextResponse.json(
      {
        success: true,
        data: profile,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.log('Profile update error:', error)

    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0]
      if (field === 'phoneNumber') {
        return NextResponse.json(
          { success: false, message: 'Nomor telepon sudah digunakan' },
          { status: 400 }
        )
      }
      if (field === 'userName') {
        return NextResponse.json(
          { success: false, message: 'Username sudah digunakan' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
