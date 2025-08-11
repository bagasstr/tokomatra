import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin =
      session.user.typeUser === 'ADMIN' ||
      session.user.typeUser === 'SUPER_ADMIN'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const url = new URL(request.url)
    const paramId = url.searchParams.get('id')
    const targetUserId = paramId ?? session.user.id

    const profile = await prisma.profile.findFirst({
      where: {
        OR: [{ id_profile: targetUserId }, { userId: targetUserId }],
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
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    return NextResponse.json({
      status: 'success',
      data: {
        profile,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export const PATCH = async (request: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = new URL(request.url)
    const paramId = url.searchParams.get('id')
    if (!paramId)
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const existingProfile = await prisma.profile.findFirst({
      where: { OR: [{ id_profile: paramId }, { userId: paramId }] },
    })
    if (!existingProfile) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }
    const body = await request.json()
    const updatable = {
      fullName: body.fullName,
      userName: body.userName,
      phoneNumber: body.phoneNumber,
      taxId: body.taxId,
      imageUrl: body.imageUrl,
    }

    const updatedProfile = await prisma.profile.update({
      where: { id_profile: existingProfile.id_profile },
      data: updatable,
    })
    return NextResponse.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        profile: updatedProfile,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
