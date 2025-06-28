import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IOrderRepository } from '../interfaces/order.repository.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { OrderStrategy } from './order.strategy';
import { PrismaService } from '@src/common/services/prisma.service';
import { OrderStatus } from '@src/common/enums/order-status.enum';
import { OrderType } from '@src/common/enums/order-type.enum';
import { OrderDto } from '../dtos/order.dto';

@Injectable()
export class SaleOrderStrategy extends OrderStrategy {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  type = OrderType.SALE;

  async createOrder(dto: CreateOrderDto, sellerId: number): Promise<OrderDto> {
    if (dto.useBalance) {
      throw new BadRequestException(
        'Vendas à vista não podem utilizar saldo do cliente.',
      );
    }

    if (!dto.payments || dto.payments.length !== 1) {
      throw new BadRequestException(
        'Vendas devem conter exatamente um pagamento correspondente ao valor total.',
      );
    }

    const payment = dto.payments[0];

    if (payment.amount !== dto.total) {
      throw new BadRequestException(
        'O valor do pagamento deve ser igual ao valor total da venda.',
      );
    }

    this.validateItems(dto.items);
    this.validateOrderTotals(dto);

    console.log('chega aqui');
    const order = await this.prisma.$transaction(async (tx) => {
      console.log('entra na transaction');
      // Verifica e atualiza estoque dos produtos
      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Produto com ID ${item.productId} não encontrado.`,
          );
        }

        const stockQuantity = Number(product.stockQuantity);
        if (stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto "${product.name}". Disponível: ${stockQuantity}, Solicitado: ${item.quantity}`,
          );
        }

        await tx.product.update({
          where: { id: product.id },
          data: {
            stockQuantity: stockQuantity - item.quantity,
          },
        });
      }

      // Cria o pedido com status "COMPLETED" e pago
      const createDto: CreateOrderDto = {
        total: dto.total,
        discount: dto.discount,
        subtotal: dto.subtotal,
        notes: dto.notes,
        customerId: dto.customerId,
        items: dto.items,
        type: OrderType.SALE,
        useBalance: false,
        status: OrderStatus.COMPLETED,
        paid: true,
        payments: dto.payments,
      };

      const order = await this.orderRepository.create(createDto, sellerId, tx);
      return order;
    });

    return order;
  }

  async updateOrder(_orderId: number, _dto: UpdateOrderDto): Promise<OrderDto> {
    throw new BadRequestException(
      'Pedidos de venda não podem ser atualizados.',
    );
  }

  async deleteOrder(orderId: number): Promise<void> {
    const existingOrder = await this.orderRepository.findById(orderId);

    if (!existingOrder) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    if (existingOrder.status === OrderStatus.COMPLETED) {
      throw new BadRequestException(
        'Pedidos finalizados não podem ser deletados.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      for (const item of existingOrder.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Produto com ID ${item.productId} não encontrado.`,
          );
        }

        await tx.product.update({
          where: { id: product.id },
          data: {
            stockQuantity: Number(product.stockQuantity) + item.quantity,
          },
        });
      }

      await tx.order.delete({
        where: { id: orderId },
      });
    });
  }
}
