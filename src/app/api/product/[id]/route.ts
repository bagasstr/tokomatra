import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (
      session?.user.role !== 'SUPER_ADMIN' &&
      session?.user.role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.products.findUnique({
      where: {
        id_product: params.id,
      },
    })
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (
      session?.user.role !== 'SUPER_ADMIN' &&
      session?.user.role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id } = params
    const product = await prisma.products.update({
      where: {
        id_product: id,
      },
      data: { ...body },
    })
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Product updated successfully',
      product,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
