'use client'

import UserSection from './user-section'
import Link from 'next/link'

import { getUserBySession } from '@/services/user-service'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { User } from '@/types/user'
import {
  Sidebar as Root,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/shadcnui/sidebar'

import {
  HardHatIcon,
  ShoppingCartSimpleIcon,
} from '@phosphor-icons/react/dist/ssr'
import { ChartColumn, Package, Tags, Users } from 'lucide-react'

interface MenuItem {
  title: string
  url: string
  icon: React.ElementType
  protected?: boolean
}

const items: MenuItem[] = [
  {
    title: 'PDV',
    url: '/pos',
    icon: ShoppingCartSimpleIcon,
  },
  {
    title: 'Pedidos',
    url: '/orders',
    icon: Tags,
  },
  {
    title: 'Estoque',
    url: '/stock/products',
    icon: Package,
  },
  {
    title: 'Movimentações',
    url: '/stock/movements',
    icon: Package,
  },
  {
    title: 'Clientes',
    url: '/customers',
    icon: Users,
  },
  {
    title: 'Relatórios',
    url: '/reports',
    icon: ChartColumn,
    protected: true,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (item: { url: string }) =>
    item.url === '/'
      ? pathname === item.url
      : pathname === item.url || pathname.startsWith(`${item.url}/`)

  const { data: user } = useQuery<User | null>({
    queryKey: ['profile'],
    queryFn: getUserBySession,
  })

  return (
    <Root collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HardHatIcon weight="fill" className="size-4" />
                </div>
                <h1 className="text-xl font-bold">Socifit</h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item)}
                    className="data-[active='true']:border-contrast data-[active='true']:border"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive({ url: '/notifications' })}
                  className="data-[active='true']:border-primary data-[active='true']:border"
                >
                  <Link href="/notifications">
                    <div className="relative">
                      <Bell />
                      {unreadNotifications !== undefined &&
                        unreadNotifications > 0 && (
                          <div className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-warning" />
                        )}
                    </div>
                    <span>Notificações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserSection user={user} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Root>
  )
}
