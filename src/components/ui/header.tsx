'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const Header = ({
  className,
  children,
  ...props
}: React.ComponentProps<'header'>) => {
  return (
    <header
      className={cn('flex items-center justify-between mb-6 h-10', className)}
      {...props}>
      {children}
    </header>
  )
}
export default Header
