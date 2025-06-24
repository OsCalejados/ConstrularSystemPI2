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
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/shadcnui/sidebar'

import { HardHatIcon } from '@phosphor-icons/react/dist/ssr'
import { ChevronRight, Package, Tags, Users } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/shadcnui/collapsible'

interface MenuItem {
  title: string
  url: string
  icon: React.ElementType
  protected?: boolean
  items?: {
    title: string
    url: string
  }[]
}

const items: MenuItem[] = [
  // {
  //   title: 'PDV',
  //   url: '/pos',
  //   icon: ShoppingCartSimpleIcon,
  // },
  {
    title: 'Pedidos',
    url: '/orders',
    icon: Tags,
    items: [
      {
        title: 'Vendas',
        url: '/orders/sales',
      },
      {
        title: 'A prazo',
        url: '/orders/installments',
      },
    ],
  },
  {
    title: 'Estoque',
    url: '/stock',
    icon: Package,
    items: [
      {
        title: 'Produtos',
        url: '/stock/products',
      },
      {
        title: 'Movimentações',
        url: '/stock/movements',
      },
    ],
  },
  {
    title: 'Clientes',
    url: '/customers',
    icon: Users,
  },
  // {
  //   title: 'Relatórios',
  //   url: '/reports',
  //   icon: ChartColumn,
  //   protected: true,
  // },
]

export default function Sidebar() {
  const pathname = usePathname()
  console.log(pathname)

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
                <h1 className="text-xl font-bold">Constrular</h1>
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
                <Collapsible
                  key={`${item.title}-${pathname}`}
                  asChild
                  defaultOpen={isActive(item)}
                >
                  <SidebarMenuItem>
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
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                  className="data-[active='true']:text-contrast data-[active='true']:bg-transparent data-[active='true']:font-medium"
                                >
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
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
