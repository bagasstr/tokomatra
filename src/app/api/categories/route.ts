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

    // Ambil query dari URL
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Hitung total data
    const totalCategories = await prisma.categories.count()

    // Ambil data paginasi
    const categories = await prisma.categories.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    const totalPages = Math.ceil(totalCategories / limit)

    // Jika page melebihi totalPages, return 404
    if (page > totalPages) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 })
    }

    // Tetap return data walaupun categories kosong
    return NextResponse.json({
      categories,
      totalCategories,
      totalPages,
      currentPage: page,
      perPage: limit,
    })
  } catch (error) {
    console.error('[GET_CATEGORIES]', error)
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

    const category = await prisma.categories.create({
      data: {
        ...body,
        userId: session?.user.id,
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Category created successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
