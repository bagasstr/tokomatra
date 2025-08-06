import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params
  if (!id) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }
  const user = await prisma.verification.findUnique({
    where: { id },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  await prisma.verification.delete({
    where: { id },
  })
  return NextResponse.json({ message: 'Verification deleted' }, { status: 200 })
}
