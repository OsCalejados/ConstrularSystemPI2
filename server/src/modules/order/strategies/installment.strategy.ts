import { IOrderRepository } from '../interfaces/order.repository.interface';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { OrderStrategy } from './order.strategy';
import { OrderType } from '@src/common/enums/order-type.enum';
import { OrderDto } from '../dtos/order.dto';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { IProductRepository } from '@src/modules/product/interfaces/product.repository.interface';
import { CustomerService } from '@src/modules/customer/services/customer.service';
import { OrderPaymentDto } from '../dtos/order-payment.dto';
import { PaymentMethod } from '@src/common/enums/payment-method.enum';
import { PrismaService } from '@src/common/services/prisma.service';
import { OrderStatus } from '@src/common/enums/order-status.enum';

@Injectable()
export class InstallmentOrderStrategy extends OrderStrategy {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    private readonly customerService: CustomerService,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  type = OrderType.INSTALLMENT;

  async createOrder(dto: CreateOrderDto, sellerId: number): Promise<OrderDto> {
    if (dto.payments && dto.payments.length > 0) {
      throw new BadRequestException(
        'Pedidos a prazo não devem conter pagamentos no momento da criação.',
      );
    }

    this.validateItems(dto.items);
    this.validateOrderTotals(dto);

    // Executa tudo dentro de uma transação
    const order = await this.prisma.$transaction(async (tx) => {
      const customer = await this.customerService.getCustomerById(
        dto.customerId,
      );

      if (!customer) {
        throw new NotFoundException('Cliente não encontrado');
      }

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
            `Estoque insuficiente para o produto "${product.name}". Disponível: ${product.stockQuantity}, Solicitado: ${item.quantity}`,
          );
        }

        await tx.product.update({
          where: { id: product.id },
          data: {
            stockQuantity: stockQuantity - item.quantity,
          },
        });
      }

      // Calcula se vai usar saldo do cliente
      let amountToPay: number | undefined = undefined;

      if (dto.useBalance && customer.balance > 0) {
        amountToPay =
          customer.balance >= dto.total ? dto.total : customer.balance;
      }

      // Monta DTO do pedido
      const createDto: CreateOrderDto = {
        total: dto.total,
        discount: dto.discount,
        subtotal: dto.subtotal,
        notes: dto.notes,
        customerId: dto.customerId,
        items: dto.items,
        type: OrderType.INSTALLMENT,
        useBalance: dto.useBalance,
        status: dto.status,
        paid: dto.paid,
        payments:
          amountToPay && amountToPay > 0
            ? [
                {
                  paidAt: new Date(),
                  netAmount: amountToPay,
                  paymentMethod: PaymentMethod.CASH,
                  change: 0,
                  amount: amountToPay,
                } as OrderPaymentDto,
              ]
            : undefined,
      };

      // Cria pedido dentro da transação
      const order = await this.orderRepository.create(createDto, sellerId, tx);

      // Atualiza saldo do cliente, se necessário
      if (amountToPay && amountToPay > 0) {
        await this.customerService.updateBalance(
          order.customerId,
          {
            balance: customer.balance - amountToPay,
          },
          tx,
        );

        // Se o saldo pagou tudo, já marca como pago e finalizado
        if (amountToPay >= order.total) {
          await this.orderRepository.updateStatus(
            order.id,
            { status: OrderStatus.COMPLETED },
            tx,
          );
          await this.orderRepository.updateIsPaid(order.id, true, tx);
        }
      }

      return order;
    });

    return order;
  }

  async updateOrder(orderId: number, dto: UpdateOrderDto): Promise<OrderDto> {
    const existingOrder = await this.orderRepository.findById(orderId);

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    if (existingOrder.status === OrderStatus.COMPLETED) {
      throw new BadRequestException(
        `Pedido com status ${existingOrder.status} não pode ser editado.`,
      );
    }

    this.validateItems(dto.items);
    this.validateOrderTotals(dto);

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      // 1️. Devolver ao estoque os itens antigos
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

      // 2. Verificar e debitar estoque dos novos itens
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

      // 3️⃣ - Montar DTO atualizado
      const updateDto: OrderDto = {
        id: undefined,
        total: dto.total,
        discount: dto.discount,
        subtotal: dto.subtotal,
        notes: dto.notes,
        customerId: dto.customerId,
        items: dto.items,
        sellerId: undefined,
        paid: existingOrder.paid,
        status: existingOrder.status,
        type: OrderType.INSTALLMENT,
        createdAt: undefined,
        seller: undefined,
        customer: undefined,
        payments: existingOrder.payments,
      };

      // 4️. - Executar update no pedido
      const updatedOrder = await this.orderRepository.update(
        orderId,
        updateDto,
        tx,
      );

      return updatedOrder;
    });

    return updatedOrder;
  }

  async deleteOrder(orderId: number): Promise<void> {
    const existingOrder = await this.orderRepository.findById(orderId, {
      includePayments: true,
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    if (existingOrder.status === OrderStatus.COMPLETED) {
      throw new BadRequestException(
        `Pedido com status ${existingOrder.status} não pode ser deletado.`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      // 1. Reposição do estoque dos produtos do pedido
      for (const item of existingOrder.items) {
        // Buscar o produto atual para pegar o estoque atualizado
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Produto com ID ${item.productId} não encontrado.`,
          );
        }

        // Atualiza estoque somando a quantidade que foi reservada no pedido
        await tx.product.update({
          where: { id: product.id },
          data: {
            stockQuantity: Number(product.stockQuantity) + item.quantity,
          },
        });
      }

      // 2. Se o pedido foi pago usando saldo do cliente, reembolsa esse saldo
      if (existingOrder.payments && existingOrder.payments.length > 0) {
        console.log('existem pagamentos');
        // Somar total pago
        const totalPaid = existingOrder.payments.reduce(
          (sum, p) => sum + p.amount,
          0,
        );

        console.log('total pago: ', totalPaid);
        console.log('cliente id: ', existingOrder.customerId);
        if (totalPaid > 0 && existingOrder.customerId) {
          // Buscar saldo atual do cliente
          const customer = await tx.customer.findUnique({
            where: { id: existingOrder.customerId },
          });

          if (!customer) {
            throw new NotFoundException('Cliente não encontrado.');
          }

          // Atualizar saldo devolvendo o valor pago
          console.log(Number(customer.balance), totalPaid);
          await tx.customer.update({
            where: { id: customer.id },
            data: {
              balance: Number(customer.balance) + totalPaid,
            },
          });
        }
      }

      // 3. Deletar o pedido (itens e pagamentos relacionados devem ser deletados em cascata ou manualmente)
      await tx.order.delete({
        where: { id: orderId },
      });
    });
  }
}
