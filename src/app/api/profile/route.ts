import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    const getProfile = await prisma.profile.findUnique({
      where: {
        userId: session?.user.id,
      },
      select: {
        id_profile: true,
        fullName: true,
        email: true,
        imageUrl: true,
        userName: true,
        phoneNumber: true,
        gender: true,
        dateOfBirth: true,
        bio: true,
        companyName: true,
        taxId: true,
        updatedAt: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    if (!getProfile) {
      return NextResponse.json(
        {
          message: 'Profile not found',
        },
        { status: 404 }
      )
    }
    return NextResponse.json(
      {
        status: 200,
        message: 'Profile fetched successfully',
        data: getProfile,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Internal Server Error',
      },
      {
        status: 500,
      }
    )
  }
}

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    await prisma.profile.create({
      data: {
        id_profile: crypto.randomUUID(),
        userId: session?.user.id as string,
        fullName: body.fullName,
        email: body.email,
        imageUrl: body.imageUrl,
        gender: 'other',
        userName: body.email.split('@')[0],
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    })

    return NextResponse.json(
      {
        message: 'Profile created successfully',
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Internal Server Error',
      },
      {
        status: 500,
      }
    )
  }
}
