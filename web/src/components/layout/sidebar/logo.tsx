import LogoIcon from '@/components/icons/logo'

import { cn } from '@/lib/utils'

interface LogoProps {
  sidebarIsOpen: boolean
}

export default function Logo({ sidebarIsOpen }: LogoProps) {
  return (
    <div className="flex items-center">
      <div className="h-10 w-10 mx-2">
        <LogoIcon size={40} />
      </div>
      <h3
        className={cn(
          'text-xl font-bold text-primary opacity-100 transition-opacity duration-200 delay-200',
          !sidebarIsOpen && 'pointer-events-none opacity-0 delay-0',
        )}
      >
        Ledger
      </h3>
    </div>
  )
}
