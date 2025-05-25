import { cn } from '@/lib/utils'

interface BadgeProps {
  children?: React.ReactNode
  className?: string
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <div
      className={cn(
        'h-4 px-2 flex items-center justify-center bg-slate-500 bg-opacity-10 rounded-full',
        className,
      )}
    >
      <span className="text-xs">{children}</span>
    </div>
  )
}
