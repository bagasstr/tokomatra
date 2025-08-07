import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

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
      include: {
        categories: {
          select: {
            categories: {
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
                  },
                },
              },
            },
          },
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
    console.log('body', body)

    if (!body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    const requiredFields = [
      'sku',
      'name',
      'slug',
      'categoryId',
      'sellingPrice',
      'purchasePrice',
      'unit',
    ]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Check if SKU already exists
    const existingSku = await prisma.products.findUnique({
      where: { sku: body.sku },
    })

    if (existingSku) {
      return NextResponse.json(
        {
          error: 'SKU already exists',
        },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingSlug = await prisma.products.findUnique({
      where: { slug: body.slug },
    })

    if (existingSlug) {
      return NextResponse.json(
        {
          error: 'Slug already exists',
        },
        { status: 400 }
      )
    }

    // Validate category exists
    const category = await prisma.categories.findUnique({
      where: { id_category: body.categoryId },
    })

    if (!category) {
      return NextResponse.json(
        {
          error: 'Category not found',
        },
        { status: 400 }
      )
    }

    // Validate brand if provided
    if (body.brandId) {
      const brand = await prisma.brands.findUnique({
        where: { id_brand: body.brandId },
      })

      if (!brand) {
        return NextResponse.json(
          {
            error: 'Brand not found',
          },
          { status: 400 }
        )
      }
    }

    // Handle images array properly
    let images: string[] = []
    if (body.images) {
      if (Array.isArray(body.images)) {
        images = body.images
      } else if (typeof body.images === 'string') {
        images = [body.images]
      }
    }

    const product = await prisma.products.create({
      data: {
        id_product: randomUUID(),
        sku: body.sku,
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        label: body.label || null,
        categoryId: body.categoryId,
        brandId: body.brandId || null,
        sellingPrice: parseInt(body.sellingPrice),
        purchasePrice: parseInt(body.purchasePrice),
        stock: parseInt(body.stock) || 0,
        unit: body.unit,
        minOrder: parseInt(body.minOrder) || 0,
        multiOrder: parseInt(body.multiOrder) || 0,
        weight: body.weight ? parseFloat(body.weight) : null,
        dimensions: body.dimensions || null,
        images: images,
        isFeatured: Boolean(body.isFeatured) || false,
        isActive: Boolean(body.isActive !== false), // Default to true unless explicitly set to false
        userId: session?.user.id || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Product created successfully',
      product,
    })
  } catch (error) {
    console.error('[POST_PRODUCT]', error)

    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      if (error.message.includes('sku')) {
        return NextResponse.json(
          {
            error: 'SKU already exists',
          },
          { status: 400 }
        )
      }
      if (error.message.includes('slug')) {
        return NextResponse.json(
          {
            error: 'Slug already exists',
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
