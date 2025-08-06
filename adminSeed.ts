import { prisma } from './src/lib/prisma'
import { hashPassword } from 'better-auth/crypto'

const adminSeed = async () => {
  try {
    const id = crypto.randomUUID()
    const admin = await prisma.user.findUnique({
      where: {
        email: 'admin@matrakosala.com',
      },
    })

    if (!admin) {
      const newAdmin = await prisma.user.create({
        data: {
          id,
          email: 'admin@matrakosala.com',
          name: 'Admin',
          role: 'SUPER_ADMIN',
          typeUser: 'SUPER_ADMIN',
          createdAt: new Date(),
          updatedAt: new Date(),
          emailVerified: true,
          banned: false,
        },
      })
      await prisma.account.create({
        data: {
          id,
          accountId: newAdmin.id,
          providerId: 'credential',

          createdAt: new Date(),
          updatedAt: new Date(),
          userId: newAdmin.id,
          password: await hashPassword('matrakosala'),
        },
      })
      console.log('Admin created')
    }
  } catch (error) {
    console.log('Admin already exists')
  }
}

adminSeed()
