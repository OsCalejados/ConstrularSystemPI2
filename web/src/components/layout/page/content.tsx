import { cn } from '@/lib/utils'

interface ContentProps {
  children?: React.ReactNode
  className?: string
}

export default function Content({ children, className }: ContentProps) {
  return (
    <div
      className={cn('pt-2 pb-14 gap-4 flex flex-col text-strong', className)}
    >
      {children}
    </div>
  )
}
