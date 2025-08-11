import { betterAuth, url } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
import {
  admin as adminPlugin,
  createAuthMiddleware,
  emailOTP,
} from 'better-auth/plugins'
import { sendOTPEmail, sendResetPasswordEmail } from './sendEmail'
import { superAdmin, admin as adminRole, user as userRole } from './permission'
import { nextCookies } from 'better-auth/next-js'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [
    'http://localhost:3000',
    'http://192.168.0.4:3000',
    'http://192.168.0.4',
    'http://localhost',
    'http://127.0.0.1:3000',
    'http://127.0.0.1',
  ],

  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendResetPasswordEmail(user.email, url, token)
    },
  },
  session: {
    expiresIn: 60 * 60 * 24, // 1 day
    updateAge: 60 * 60 * 24, // 1 day
    freshAge: 60 * 5, // 5 minutes
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day
    },
  },

  admin: {
    enabled: true,
    additionalFields: {
      defaultRole: {
        type: 'string',
        input: false,
        defaultValue: 'SUPER_ADMIN',
        fieldName: 'defaultRole',
      },
      role: {
        type: 'string',
        input: false,
        defaultValue: 'SUPER_ADMIN',
        fieldName: 'role',
      },
      typeUser: {
        type: 'string',
        input: true,
        fieldName: 'typeUser',
        required: true,
      },
    },
  },
  user: {
    enabled: true,
    additionalFields: {
      typeUser: {
        type: 'string',
        input: false,
        fieldName: 'typeUser',
        required: false,
        defaultValue: 'CUSTOMER',
      },
      defaultRole: {
        type: 'string',
        input: false,
        defaultValue: 'CUSTOMER',
        fieldName: 'role',
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'CUSTOMER',
        input: false,
      },
    },
  },

  plugins: [
    adminPlugin({
      adminRoles: ['SUPER_ADMIN', 'ADMIN'],
      roles: {
        SUPER_ADMIN: superAdmin,
        ADMIN: adminRole,
        USER: userRole,
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendOTPEmail(email, otp, type)
      },
      allowedAttempts: 5,
    }),
    nextCookies(),
  ],
})
