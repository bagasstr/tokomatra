import {
  Breadcrumb,
  BreadcrumbPage,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

const KategoriPage = () => {
  return (
    <div className={cn('')}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/kategori'>Kategori</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className='mt-10'>Semua Kategori</h1>
      <div className='grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-3 gap-4 mt-10'>
        <div className='bg-white rounded-lg shadow-sm p-4'>
          <h2 className='text-lg font-bold'>Kategori 1</h2>
        </div>
      </div>
    </div>
  )
}
export default KategoriPage
