import { FindOrderOptions } from '../interfaces/find-order-options.interface';
import { IOrderRepository } from '../interfaces/order.repository.interface';
import { UpdateStatusDto } from '../dtos/update-status';
import { UpdateNotesDto } from '../dtos/update-notes';
import { PrismaService } from '@src/common/services/prisma.service';
import { OrderMapper } from '../mappers/order.mapper';
import { Injectable } from '@nestjs/common';
import { OrderDto } from '../dtos/order.dto';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(options?: FindOrderOptions): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        payments: options?.includePayments ?? false,
        customer: options?.includeCustomer ?? false,
        seller: options?.includeSeller ?? false,
        items: options?.includeProducts ?? false,
      },
    });

    return orders.map((order) => OrderMapper.toDto(order));
  }

  async findById(
    orderId: number,
    options?: FindOrderOptions,
  ): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      include: {
        payments: options?.includePayments ?? false,
        customer: options?.includeCustomer ?? false,
        seller: options?.includeSeller ?? false,
        items: options?.includeProducts ?? false,
      },
      where: {
        id: orderId,
      },
    });

    console.log(order);

    return OrderMapper.toDto(order);
  }

  async findByCustomer(customerId: number): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        customerId,
      },
    });

    return orders.map((order) => OrderMapper.toDto(order));
  }

  async findByProductId(productId: number): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            productId,
          },
        },
      },
    });

    return orders.map((order) => OrderMapper.toDto(order));
  }

  async create(order: OrderDto, sellerId: number): Promise<OrderDto> {
    const createdOrder = await this.prisma.order.create({
      data: {
        status: order.status,
        total: order.total,
        subtotal: order.subtotal,
        type: order.type,
        discount: order.discount,
        paid: order.paid,
        notes: order.notes,
        seller: {
          connect: {
            id: sellerId ?? undefined,
          },
        },
        customer: {
          connect: {
            id: order.customerId ?? undefined,
          },
        },
        items: {
          createMany: {
            data: order.items,
          },
        },
      },
    });
    return OrderMapper.toDto(createdOrder);
  }

  async update(orderId: number, order: OrderDto): Promise<OrderDto> {
    const updatedOrder = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: order.status,
        total: order.total,
        type: order.type,
        discount: order.discount,
        subtotal: order.subtotal,
        paid: order.paid,
        notes: order.notes,
        customerId: order.customerId,
        items: {
          deleteMany: {},
          createMany: {
            data: order.items,
          },
        },
      },
    });

    return OrderMapper.toDto(updatedOrder);
  }

  async updateNotes(orderId: number, updateStatusDto: UpdateNotesDto) {
    const updatedOrder = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        notes: updateStatusDto.notes,
      },
    });

    return OrderMapper.toDto(updatedOrder);
  }

  async updateStatus(orderId: number, updateStatusDto: UpdateStatusDto) {
    const updatedOrder = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: updateStatusDto.status,
      },
    });

    return OrderMapper.toDto(updatedOrder);
  }

  async deleteById(orderId: number): Promise<OrderDto> {
    const deletedOrder = await this.prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    return OrderMapper.toDto(deletedOrder);
  }
}
