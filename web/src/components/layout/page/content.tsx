import { cn } from '@/lib/utils'

interface ContentProps {
  children?: React.ReactNode
  className?: string
}

export default function Content({ children, className }: ContentProps) {
  return (
    <div className={cn('py-2 gap-4 flex flex-col text-strong', className)}>
      {children}
    </div>
  )
}
