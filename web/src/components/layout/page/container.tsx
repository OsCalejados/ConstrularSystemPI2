import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children?: ReactNode
  className?: string
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn('h-screen overflow-y-auto h-full px-12 pb-12', className)}
        {...props}
      >
        <div ref={ref} className="h-full">
          {children}
        </div>
      </div>
    )
  },
)

Container.displayName = 'Container'

export default Container
