'use client'

import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  children?: React.ReactNode
}

export default function Header({ children }: HeaderProps) {
  const router = useRouter()

  return (
    <>
      <div className="h-[84px] flex items-center justify-between">
        <button onClick={router.back}>
          <ArrowLeft size={20} />
        </button>
      </div>
      {children}
    </>
  )
}
