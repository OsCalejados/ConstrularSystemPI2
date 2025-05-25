import { OrderStatus } from '@/enums/order-status'
import { customers } from './customers'
import { Order } from '@/types/order'

export const orders: Order[] = [
  {
    id: 1,
    status: OrderStatus.PENDING,
    notes: 'Dar desconto de 5% no dia da entrega',
    items: [
      { id: 0, name: 'Produto 1', unit: 'UN', quantity: 6 },
      { id: 1, name: 'Produto 2', unit: 'UN', quantity: 30 },
      { id: 2, name: 'Produto 3', unit: 'MT', quantity: 14 },
      { id: 3, name: 'Produto 4', unit: 'UN', quantity: 500 },
    ],
    payments: [
      { id: 1, value: 15 },
      { id: 2, value: 40 },
      { id: 3, value: 120 },
    ],
    customer: customers[0],
    createdAt: '2024-08-28T00:41:03.230Z',
  },
  {
    id: 2,
    status: OrderStatus.PAID,
    items: [
      { id: 0, name: 'Produto 5', unit: 'KG', quantity: 2 },
      { id: 1, name: 'Produto 6', unit: 'UN', quantity: 10 },
    ],
    customer: customers[2],
    createdAt: '2024-08-29T11:15:22.340Z',
  },
  {
    id: 3,
    status: OrderStatus.PENDING,
    notes: '',
    items: [
      { id: 0, name: 'Produto 7', unit: 'MT', quantity: 5 },
      { id: 1, name: 'Produto 8', unit: 'UN', quantity: 1 },
      { id: 2, name: 'Produto 9', unit: 'UN', quantity: 3 },
    ],
    customer: customers[3],
    createdAt: '2024-08-30T14:22:15.550Z',
  },
  {
    id: 4,
    status: OrderStatus.PENDING,
    notes: 'Verificar estoque antes de enviar',
    items: [{ id: 0, name: 'Produto 10', unit: 'KG', quantity: 1 }],
    customer: customers[4],
    createdAt: '2024-08-31T09:35:47.670Z',
  },
  {
    id: 5,
    status: OrderStatus.PAID,
    notes: 'Adicionar brinde ao pedido',
    items: [
      { id: 0, name: 'Produto 11', unit: 'UN', quantity: 8 },
      { id: 1, name: 'Produto 12', unit: 'UN', quantity: 12 },
      { id: 2, name: 'Produto 13', unit: 'KG', quantity: 3 },
    ],
    customer: customers[5],
    createdAt: '2024-09-01T16:40:55.780Z',
  },
  {
    id: 6,
    status: OrderStatus.PAID,
    notes: 'Confirmar endereço de entrega',
    items: [
      { id: 0, name: 'Produto 14', unit: 'MT', quantity: 10 },
      { id: 1, name: 'Produto 15', unit: 'UN', quantity: 5 },
    ],
    customer: customers[6],
    createdAt: '2024-09-02T12:55:33.890Z',
  },
  {
    id: 7,
    status: OrderStatus.PENDING,
    notes: 'Solicitar pagamento antecipado',
    items: [
      { id: 0, name: 'Produto 16', unit: 'UN', quantity: 2 },
      { id: 1, name: 'Produto 17', unit: 'KG', quantity: 4 },
      { id: 2, name: 'Produto 18', unit: 'UN', quantity: 7 },
      { id: 3, name: 'Produto 19', unit: 'MT', quantity: 6 },
    ],
    customer: customers[7],
    createdAt: '2024-09-03T10:10:22.990Z',
  },
  {
    id: 8,
    status: OrderStatus.PAID,
    notes: 'Enviar amostras de produto',
    items: [
      { id: 0, name: 'Produto 20', unit: 'UN', quantity: 3 },
      { id: 1, name: 'Produto 21', unit: 'MT', quantity: 8 },
    ],
    customer: customers[8],
    createdAt: '2024-09-04T15:20:11.110Z',
  },
  {
    id: 9,
    status: OrderStatus.PAID,
    notes: 'Garantia de entrega no prazo',
    items: [
      { id: 0, name: 'Produto 22', unit: 'UN', quantity: 1 },
      { id: 1, name: 'Produto 23', unit: 'KG', quantity: 9 },
    ],
    customer: customers[9],
    createdAt: '2024-09-05T13:25:37.220Z',
  },
  {
    id: 10,
    status: OrderStatus.PENDING,
    notes: 'Oferecer opção de pagamento parcelado',
    items: [
      { id: 0, name: 'Produto 24', unit: 'UN', quantity: 5 },
      { id: 1, name: 'Produto 25', unit: 'UN', quantity: 6 },
    ],
    customer: customers[10],
    createdAt: '2024-09-06T08:30:28.330Z',
  },
  {
    id: 11,
    status: OrderStatus.PAID,
    notes: 'Confirmar dados de contato',
    items: [
      { id: 0, name: 'Produto 26', unit: 'KG', quantity: 7 },
      { id: 1, name: 'Produto 27', unit: 'UN', quantity: 4 },
      { id: 2, name: 'Produto 28', unit: 'UN', quantity: 2 },
    ],
    customer: customers[11],
    createdAt: '2024-09-07T18:45:50.440Z',
  },
  {
    id: 12,
    status: OrderStatus.PENDING,
    notes: 'Verificar condição do produto antes do envio',
    items: [
      { id: 0, name: 'Produto 29', unit: 'UN', quantity: 8 },
      { id: 1, name: 'Produto 30', unit: 'MT', quantity: 12 },
    ],
    customer: customers[12],
    createdAt: '2024-09-08T07:55:33.550Z',
  },
  {
    id: 13,
    status: OrderStatus.PAID,
    notes: 'Revisar pedido antes de confirmar',
    items: [{ id: 0, name: 'Produto 31', unit: 'UN', quantity: 4 }],
    customer: customers[13],
    createdAt: '2024-09-09T20:05:15.660Z',
  },
  {
    id: 14,
    status: OrderStatus.PAID,
    notes: 'Enviar confirmação de pedido por e-mail',
    items: [
      { id: 0, name: 'Produto 32', unit: 'KG', quantity: 3 },
      { id: 1, name: 'Produto 33', unit: 'UN', quantity: 2 },
    ],
    customer: customers[14],
    createdAt: '2024-09-10T16:15:02.770Z',
  },
  {
    id: 15,
    status: OrderStatus.PAID,
    notes: 'Agendar entrega com o cliente',
    items: [
      { id: 0, name: 'Produto 34', unit: 'UN', quantity: 10 },
      { id: 1, name: 'Produto 35', unit: 'MT', quantity: 5 },
    ],
    customer: customers[15],
    createdAt: '2024-09-11T12:25:22.880Z',
  },
  {
    id: 16,
    status: OrderStatus.PAID,
    notes: 'Solicitar feedback após a entrega',
    items: [
      { id: 0, name: 'Produto 36', unit: 'KG', quantity: 6 },
      { id: 1, name: 'Produto 37', unit: 'UN', quantity: 3 },
      { id: 2, name: 'Produto 38', unit: 'UN', quantity: 8 },
    ],
    customer: customers[16],
    createdAt: '2024-09-12T08:35:18.990Z',
  },
]
