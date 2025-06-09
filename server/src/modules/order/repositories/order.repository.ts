/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { PrismaService } from '@src/common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateStatusDto } from '../dtos/update-status';
import { UpdateNotesDto } from '../dtos/update-notes';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderItem } from '@prisma/client';

const orderMockada = {
  id: 1,
  customerId: 123,
  sellerId: 456,
  type: 'online', // Exemplo de tipo
  status: 'pending', // Exemplo de status
  total: new Decimal(100.5), // Total da ordem
  discount: new Decimal(10.0), // Desconto aplicado
  paymentMethod: 'credit_card', // Método de pagamento
  paid: false, // Indica se foi pago
  installments: 3, // Parcelas (se aplicável)
  amountPaid: null, // Valor pago (se aplicável)
  createdAt: new Date(), // Data de criação
  customer: {
    id: 123,
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  seller: {
    id: 456,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
  },
  items: [
    {
      id: 1,
      productId: 789,
      quantity: 2,
      price: new Decimal(50.25),
    },
    {
      id: 2,
      productId: 790,
      quantity: 1,
      price: new Decimal(30.0),
    },
  ],
};

const itemOrderMockado = {
  id: 1,
  orderId: 1,
  productId: 789,
  quantity: 2,
  unityPrice: new Decimal(50.25),
  total: new Decimal(100.5),
} as unknown as OrderItem;

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return Promise.resolve([orderMockada]);
    // return await this.prisma.order.findMany({
    //   include: {
    //     customer: true,
    //   },
    // });
  }

  async findById(orderId: number) {
    return Promise.resolve(orderMockada);
    // return await this.prisma.order.findUnique({
    //   where: {
    //     id: orderId,
    //   },
    //   include: {
    //     items: true,
    //     customer: {
    //       include: {
    //         address: true,
    //       },
    //     },
    //     payments: true,
    //   },
    // });
  }

  async findByCustomer(
    customerId: number,
    page: number = 1,
    pageSize: number = 12,
    status?: string,
  ) {
    return Promise.resolve([orderMockada]);
    // const skip = (page - 1) * pageSize;
    // const totalItems = await this.prisma.order.count({
    //   where: {
    //     customerId: customerId,
    //     ...(status && { status: status }),
    //   },
    // });
    // const orders = await this.prisma.order.findMany({
    //   include: {
    //     items: true,
    //   },
    //   where: {
    //     customerId: customerId,
    //     ...(status && { status: status }),
    //   },
    //   skip: skip,
    //   take: pageSize,
    // });
    // return {
    //   totalItems,
    //   orders,
    // };
  }

  async findOrderItemByProduct(
    productId: number,
    page: number = 1,
    pageSize: number = 12,
    status?: string,
  ) {
    return Promise.resolve([itemOrderMockado]);
    // const skip = (page - 1) * pageSize;
    // const totalItems = await this.prisma.order.count({
    //   where: {
    //     customerId: customerId,
    //     ...(status && { status: status }),
    //   },
    // });
    // const orders = await this.prisma.order.findMany({
    //   include: {
    //     items: true,
    //   },
    //   where: {
    //     customerId: customerId,
    //     ...(status && { status: status }),
    //   },
    //   skip: skip,
    //   take: pageSize,
    // });
    // return {
    //   totalItems,
    //   orders,
    // };
  }

  async create(order: CreateOrderDto) {
    return Promise.resolve(orderMockada);
    // return await this.prisma.order.create({
    //   data: {
    //     customerId: order.customerId,
    //     notes: order.notes,
    //     status: order.status,
    //     items: {
    //       createMany: {
    //         data: order.items,
    //       },
    //     },
    //   },
    // });
  }

  async update(orderId: number, order: UpdateOrderDto) {
    return Promise.resolve(orderMockada);
    // return await this.prisma.order.update({
    //   where: {
    //     id: orderId,
    //   },
    //   data: {
    //     customerId: order.customerId,
    //     notes: order.notes,
    //     status: order.status,
    //     items: {
    //       createMany: {
    //         data: order.items,
    //       },
    //     },
    //   },
    // });
  }

  async updateNotes(orderId: number, updateStatusDto: UpdateNotesDto) {
    return Promise.resolve(orderMockada);
    // return await this.prisma.order.update({
    //   where: {
    //     id: orderId,
    //   },
    //   data: {
    //     notes: updateStatusDto.notes,
    //   },
    // });
  }

  async updateStatus(orderId: number, updateStatusDto: UpdateStatusDto) {
    return Promise.resolve(orderMockada);
    // return await this.prisma.order.update({
    //   where: {
    //     id: orderId,
    //   },
    //   data: {
    //     status: updateStatusDto.status,
    //   },
    // });
  }

  async delete(orderId: number) {
    return;
    // return await this.prisma.order.delete({
    //   where: {
    //     id: orderId,
    //   },
    // });
  }

  async deleteMany(orderIds: number[]) {
    return;

    // return await this.prisma.order.deleteMany({
    //   where: {
    //     id: {
    //       in: orderIds,
    //     },
    //   },
    // });
  }
}
