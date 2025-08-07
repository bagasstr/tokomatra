import z from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z
  .object({
    fullName: z.string().min(1, 'Nama wajib diisi'),
    email: z.string().min(8, 'Email wajib diisi'),
    password: z
      .string()
      .min(1, 'Password wajib diisi')
      .min(8, 'Password minimal 8 karakter'),
    confirm_password: z
      .string()
      .min(1, 'Konfirmasi password wajib diisi')
      .min(8, 'Konfirmasi password minimal 8 karakter'),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Password dan konfirmasi password tidak sama',
  })

export const editProfileSchema = z.object({
  fullName: z.string().min(1, 'Nama lengkap wajib diisi'),
  userName: z.string().min(1, 'Username wajib diisi'),
  phoneNumber: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z.string().min(1, 'Tanggal lahir wajib diisi'),
  bio: z.string().optional(),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
  imageUrl: z.string().optional(),
})

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
})

export const adminLoginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

export const formAddProductSchema = z.object({
  sku: z.string('SKU wajib diisi'),
  name: z.string('Nama produk wajib diisi'),
  slug: z.string('Slug wajib diisi'),
  description: z.string().optional(),
  label: z.string().optional(),
  categoryId: z.string().min(1, 'Kategori harus dipilih'),
  brandId: z.string().optional(),
  dimensions: z.string().optional(),
  sellingPrice: z.string().superRefine((val, ctx) => {
    if (val === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Harga harus diisi',
      })
    }
    if (isNaN(Number(val))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Harga harus berupa angka',
      })
    }
  }),
  purchasePrice: z.string().superRefine((val, ctx) => {
    if (val === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Harga harus diisi',
      })
    }
    if (isNaN(Number(val))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Harga harus berupa angka',
      })
    }
  }),
  stock: z.string().superRefine((val, ctx) => {
    if (val === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Stok harus diisi',
      })
    }
    if (isNaN(Number(val))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Stok harus berupa angka',
      })
    }
  }),
  unit: z.string('Unit wajib diisi'),
  minOrder: z.string().superRefine((val, ctx) => {
    if (val === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Minimal order harus diisi',
      })
    }
    if (isNaN(Number(val))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Minimal order harus berupa angka',
      })
    }
  }),
  multiOrder: z.string().superRefine((val, ctx) => {
    if (val === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Kelipatan order harus diisi',
      })
    }
    if (isNaN(Number(val))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Kelipatan order harus berupa angka',
      })
    }
  }),
  weight: z.string().optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
})
