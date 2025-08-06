import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
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

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const search = searchParams.get('search') || ''

    const totalProducts = await prisma.products.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    })

    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    const totalPages = Math.ceil(totalProducts / limit)

    if (page > totalPages && totalPages !== 0) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json({
      products,
      totalProducts,
      totalPages,
      currentPage: page,
      perPage: limit,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export const POST = async (req: Request) => {
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
    // const {
    //   sku,
    //   name,
    //   slug,
    //   description,
    //   label,
    //   images,
    //   sellingPrice,
    //   purchasePrice,
    //   unit,
    //   stock,
    //   minOrder,
    //   multiOrder,
    //   weight,
    //   dimensions,
    //   isFeatured,
    //   isActive,
    //   categoryId,
    //   brandId,
    //   userId,
    // } = body
    if (!body) {
      return NextResponse.json({ message: 'Form is required' }, { status: 400 })
    }

    const product = await prisma.products.create({
      data: {
        ...body,
        userId: session?.user.id,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Product created successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
