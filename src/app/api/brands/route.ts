import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const brands = await prisma.brands.findMany()
  return NextResponse.json(brands)
}

export const POST = async (req: Request) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const brand = await prisma.brands.create({
    data: {
      id_brand: crypto.randomUUID(),
      name: body.name,
      logo: body.logo ?? null,
      slug: body.name.toLowerCase().replace(/ /g, '-'),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  return NextResponse.json(brand)
}
