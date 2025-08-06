import { createAccessControl } from 'better-auth/plugins/access'

export const statement = {
  project: ['create', 'share', 'update', 'delete'], // <-- Permissions available for created roles
} as const

const ac = createAccessControl(statement)

export const user = ac.newRole({
  project: ['create'],
})

export const admin = ac.newRole({
  project: ['create', 'update'],
})

export const superAdmin = ac.newRole({
  project: ['create', 'update', 'delete'],
})
