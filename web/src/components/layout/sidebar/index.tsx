'use client'

import ToggleButton from './toggle-button'
import Logo from './logo'
import Menu from './menu'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div
      className={cn(
        'relative w-64 p-6 border-r-primary border text-secondary font-medium transition-all duration-500',
        !isOpen && 'w-[106px]',
      )}
    >
      <Logo sidebarIsOpen={isOpen} />
      <ToggleButton sidebarIsOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <Menu sidebarIsOpen={isOpen} />
    </div>
  )
}
