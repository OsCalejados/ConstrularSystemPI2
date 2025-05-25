'use client'

import Link from 'next/link'

import { usePathname } from 'next/navigation'
import { menu } from '@/data/sidebar-menu'
import { cn } from '@/lib/utils'

interface MenuProps {
  sidebarIsOpen: boolean
}
export default function Menu({ sidebarIsOpen }: MenuProps) {
  const pathname = usePathname()

  return (
    <div className="mt-20 flex flex-col gap-2">
      {/* Title */}
      <span className="text-xs w-14 text-center">MENU</span>

      {/* Menu */}
      <ul className="flex flex-col gap-2">
        {menu.map((item) => {
          const isActive =
            pathname === item.path || pathname.startsWith(item.path)

          return (
            <Link key={item.id} href={item.path}>
              <li
                className={cn(
                  'flex items-center h-10 cursor-pointer rounded-lg',
                  isActive && 'text-contrast bg-table-header',
                  !isActive && 'hover:text-primary',
                )}
              >
                {/* Icon */}
                <div className="min-w-14 flex items-center justify-center">
                  {item.icon}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'text-sm opacity-100 transition-opacity duration-200 delay-200',
                    !sidebarIsOpen && 'opacity-0 pointer-events-none delay-0',
                  )}
                >
                  {item.label}
                </span>
              </li>
            </Link>
          )
        })}
      </ul>
    </div>
  )
}
