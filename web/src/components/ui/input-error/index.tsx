import { cn } from '@/lib/utils'

interface InputErrorProps {
  error?: string | undefined
  className?: string
}

export default function InputError({ error, className }: InputErrorProps) {
  if (error) {
    return <span className={cn('text-xs text-danger', className)}>{error}</span>
  }
}
