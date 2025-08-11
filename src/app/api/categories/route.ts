import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
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

    // Jika ada parameter page dan limit, gunakan pagination untuk semua kategori
    if (searchParams.has('page') || searchParams.has('limit')) {
      // Hitung total data
      const totalCategories = await prisma.categories.count()

      // Ambil data paginasi
      const categories = await prisma.categories.findMany({
        select: {
          id_category: true,
          name: true,
          slug: true,
          parentId: true,
          categories: {
            select: {
              id_category: true,
              name: true,
              slug: true,
            },
          },
          children: {
            select: {
              id_category: true,
              name: true,
              slug: true,
              parentId: true,
              children: {
                select: {
                  id_category: true,
                  name: true,
                  slug: true,
                  parentId: true,
                },
              },
            },
          },
        },
        orderBy: [{ name: 'asc' }, { parentId: 'asc' }],
        skip,
        take: limit,
      })

      const totalPages = Math.ceil(totalCategories / limit)

      // Jika page melebihi totalPages, return 404
      if (page > totalPages) {
        return NextResponse.json({ message: 'Page not found' }, { status: 404 })
      }

      return NextResponse.json(categories)
    } else {
      // Jika tidak ada pagination, ambil hanya parent categories dengan children
      const parentCategories = await prisma.categories.findMany({
        where: {
          parentId: null, // Hanya ambil parent categories
        },
        select: {
          id_category: true,
          name: true,
          slug: true,
          parentId: true,
          children: {
            select: {
              id_category: true,
              name: true,
              slug: true,
              parentId: true,
              children: {
                select: {
                  id_category: true,
                  name: true,
                  slug: true,
                  parentId: true,
                },
              },
            },
            orderBy: {
              name: 'asc',
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      })

      return NextResponse.json(parentCategories)
    }
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
    const { searchParams } = new URL(req.url)
    const parentId = searchParams.get('parentId')

    const body = await req.json()

    if (!body) {
      return NextResponse.json({ message: 'Form is required' }, { status: 400 })
    }

    const slug = body.name.toLowerCase().replace(/ /g, '-')

    // If parentId is present, create a subcategory with parentId
    if (parentId) {
      const existingCategory = await prisma.categories.findFirst({
        where: {
          id_category: parentId,
        },
      })
      if (!existingCategory) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 404 }
        )
      }
      await prisma.categories.create({
        data: {
          id_category: randomUUID(),
          name: body.name,
          slug: slug,
          parentId: parentId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    } else {
      // If no parentId, create a root category
      await prisma.categories.create({
        data: {
          id_category: randomUUID(),
          name: body.name,
          slug: slug,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
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
