import { ButtonHTMLAttributes } from 'react'
import { CaretLeft } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'

interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  sidebarIsOpen: boolean
}

export default function ToggleButton({
  sidebarIsOpen,
  ...props
}: ToggleButtonProps) {
  return (
    <button
      className="absolute top-[84px] bg-white right-0 w-8 flex items-center justify-center translate-x-1/2 h-8 rounded-lg border-primary border-2"
      {...props}
    >
      <CaretLeft
        size={24}
        className={cn(
          'rotate-0 transition duration-500',
          !sidebarIsOpen && '-rotate-180',
        )}
      />
    </button>
  )
}
