import { randomUUID } from 'crypto'
import { prisma } from './src/lib/prisma'
async function seedCategories() {
  const categoriesData = [
    {
      id_category: randomUUID(),
      name: 'Dinding',
      image: '/assets/categories/bata.png',
    },
    {
      id_category: randomUUID(),
      name: 'Besi Beton & Wiremesh',
      image: '/assets/categories/besi-beton.png',
    },
    {
      id_category: randomUUID(),
      name: 'Semen dan Sejenisnya',
      image: '/assets/categories/semen.png',
    },
    {
      id_category: randomUUID(),
      name: 'Lantai',
      image: '/assets/categories/keramik.png',
    },
    {
      id_category: randomUUID(),
      name: 'Atap & Rangka',
      image: '/assets/categories/atap.png',
    },
    {
      id_category: randomUUID(),
      name: 'Plafon & Partisi',
      image: '/assets/categories/partisi.png',
    },
    {
      id_category: randomUUID(),
      name: 'Sistem Pemipaan',
      image: '/assets/categories/pipa.png',
    },
    {
      id_category: randomUUID(),
      name: 'Material Alam',
      image: '/assets/categories/batu-kerikil.png',
    },

    {
      id_category: randomUUID(),
      name: 'Aksesoris Dapur',
      image: '/assets/categories/keran.png',
    },
    {
      id_category: randomUUID(),
      name: 'Sanitari & Aksesoris',
      image: '/assets/categories/sanitari.png',
    },
    {
      id_category: randomUUID(),
      name: 'Aksesoris Kamar Mandi',
      image: '/assets/categories/shower.png',
    },
  ]

  for (const category of categoriesData) {
    console.log(category)
    await prisma.categories.create({
      data: {
        id_category: category.id_category,
        name: category.name,
        image: category.image,
        slug: category.name
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/&/g, 'dan'),
      },
    })
  }

  console.log('Categories seeded successfully')
}

seedCategories()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
