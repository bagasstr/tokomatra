import { prisma } from './src/lib/prisma'
import { hashPassword } from 'better-auth/crypto'

const adminSeed = async () => {
  try {
    const email = 'admin@matrakosala.com'
    const ADMIN_USER_ID = crypto.randomUUID().replace(/-/g, '')

    const user = await prisma.user.upsert({
      where: { id: ADMIN_USER_ID },
      update: { updatedAt: new Date() },
      create: {
        id: ADMIN_USER_ID,
        email,
        name: 'Admin Toko Matra',
        role: 'ADMIN',
        typeUser: 'SUPER_ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: true,
        banned: false,
      },
    })

    const existingAccount = await prisma.account.findFirst({
      where: { userId: user.id, providerId: 'credential' },
    })

    if (!existingAccount) {
      await prisma.account.create({
        data: {
          id: crypto.randomUUID().replace(/-/g, '').replace(/-/g, ''),
          accountId: user.id,
          providerId: 'credential',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user.id,
          password: await hashPassword('matrakosala'),
        },
      })
    }

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: { updatedAt: new Date() },
      create: {
        id_profile: crypto.randomUUID().replace(/-/g, ''),
        userId: user.id,
        fullName: 'Admin Matra Kosala Digdaya',
        email: user.email,
        userName: 'Admin Toko Matra',
        // phoneNumber optional to avoid unique conflicts in repeated seeding
        // dateOfBirth column is @db.VarChar(20), use YYYY-MM-DD to avoid P2000
        dateOfBirth: new Date().toISOString().slice(0, 10),
        companyName: 'Matra Kosala Digdaya',
        taxId: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    console.log('Admin created successfully!')
  } catch (error) {
    console.error('Admin seed error:', error)
  }
}

adminSeed()
