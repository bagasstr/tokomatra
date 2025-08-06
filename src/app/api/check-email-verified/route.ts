import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ verified: false }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { emailVerified: true },
  })

  if (!user) {
    return NextResponse.json({ verified: false })
  }

  return NextResponse.json({ verified: !!user.emailVerified })
}
