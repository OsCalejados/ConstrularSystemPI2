import { useTabsContext } from './tabs-context'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContentProps {
  children?: ReactNode
  className?: string
  value: string
}

export default function Content({ value, className, children }: ContentProps) {
  const { selectedTab } = useTabsContext()

  return selectedTab === value ? (
    <div className={(cn('mt-4'), className)}>{children}</div>
  ) : null
}
