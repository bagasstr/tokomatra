import AllProductSection from '@/components/client/allProductSection'
import BenefitSection from '@/components/client/benefitSection'
import BrandsSection from '@/components/client/brandsSection'
import CategorySection from '@/components/client/categorySection'
import FeaturedProductSection from '@/components/client/featuredProductSection'
import FaqSection from '@/components/client/faqSection'
import { cn } from '@/lib/utils'
import BannerComplatedProfile from '@/components/client/bannerComplatedProfile'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const HomePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return (
    <div className={cn('')}>
      {session && <BannerComplatedProfile />}
      <div className='space-y-24 mt-5'>
        <CategorySection />
        <FeaturedProductSection />
        <AllProductSection />
        <BrandsSection />
        <BenefitSection />
        <FaqSection />
      </div>
    </div>
  )
}
export default HomePage
