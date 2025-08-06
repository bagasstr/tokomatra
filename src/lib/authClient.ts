import {
  emailOTPClient,
  inferAdditionalFields,
  adminClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',

  plugins: [
    adminClient(),
    emailOTPClient(),
    inferAdditionalFields({
      admin: {
        role: {
          type: 'string',
          defaultValue: 'SUPER_ADMIN',
          required: false,
          fieldName: 'role',
          input: false,
        },
      },
      user: {
        role: {
          type: 'string',
          defaultValue: 'CUSTOMER',
          required: false,
          fieldName: 'role',
          input: false,
        },
        typeUser: {
          type: 'string',
          defaultValue: 'CUSTOMER',
          input: false,
        },
      },
    }),
  ],
})

export const { signIn, signUp, useSession, signOut } = authClient

export async function isEmailVerified(email: string): Promise<boolean> {
  const res = await fetch(
    `/api/check-email-verified?email=${encodeURIComponent(email)}`
  )
  if (!res.ok) return false
  const data = await res.json()
  return data.verified
}
