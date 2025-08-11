export interface IProfile {
  data: {
    profile: {
      id_profile: string
      fullName: string
      email?: string
      imageUrl: string
      userName: string
      phoneNumber: string
      gender?: string
      dateOfBirth?: string
      bio?: string
      companyName?: string
      taxId?: string
      createdAt: Date
      updatedAt: Date
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

export interface Category {
  id_category: string
  name: string
  slug: string
  description?: string
  icon?: string
  imageUrl?: string
  isActive: boolean
  parentId?: string
  createdAt: string
  updatedAt: string
  children?: Category[]
}

export interface CategorySelectorProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}
