import { Tote } from '@phosphor-icons/react/dist/ssr'
import { User, Package } from 'lucide-react'

export const menu = [
  {
    id: 'customers',
    label: 'Clientes',
    path: '/customers',
    icon: <User size={24} />,
  },
  {
    id: 'products',
    label: 'Estoque',
    path: '/products',
    icon: <Package size={24} />,
  },
  {
    id: 'orders',
    label: 'Pedidos',
    path: '/orders',
    icon: <Tote size={24} />,
  },
]
