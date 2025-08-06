export interface Profile {
  data: {
    id_profile: string
    fullName: string
    email: string
    imageUrl: string
    userName: string
    phoneNumber: string
    gender: string
    dateOfBirth: string
    bio: string
    companyName: string
    taxId: string
    updatedAt: Date
    createdAt: Date
    users: {
      id: string
      email: string
      name: string
    }
  }
}

export interface Notification {
  id_notification: string | null
  title: string | null
  message: string | null
  isRead: boolean | null
  createdAt: Date | null
}
