import Link from 'next/link'

import { SidebarMenuButton } from '@/components/shadcnui/sidebar'
import { getUserInitials } from '@/utils/get-user-initials'
import { ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { logout } from '@/app/_actions/auth'
import { User } from '@/types/user'
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenu,
} from '@/components/shadcnui/dropdown-menu'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcnui/avatar'

interface UserSectionProps {
  user?: User | null
}

export default function UserSection({ user }: UserSectionProps) {
  const router = useRouter()
  const handleLogout = async () => {
    await logout()
    router.replace('/')
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={undefined} alt="Usuário" />
            <AvatarFallback className="rounded-lg">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
          </div>
          <ChevronUp className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuItem>
          <Link href="/settings/account">
            <span>Conta</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
