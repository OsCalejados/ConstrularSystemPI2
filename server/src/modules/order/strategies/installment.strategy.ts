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
} from '@nestjs/common';
import { CustomerService } from '@src/modules/customer/services/customer.service';
import { OrderStatus } from '@src/common/enums/order-status.enum';
import { PaymentMethod } from '@src/common/enums/payment-method.enum';
import { OrderPaymentDto } from '../dtos/order-payment.dto';

@Injectable()
export class InstallmentOrderStrategy extends OrderStrategy {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly customerService: CustomerService,
  ) {
    super();
  }

  type = OrderType.INSTALLMENT;

  async createOrder(dto: CreateOrderDto, sellerId: number): Promise<OrderDto> {
    if (!dto.customerId) {
      throw new BadRequestException(
        'Cliente é obrigatório para pedido a prazo.',
      );
    }

    if (dto.payments && dto.payments.length > 0) {
      throw new BadRequestException(
        'Pedidos a prazo não devem conter pagamentos no momento da criação.',
      );
    }

    const customer = await this.customerService.getCustomerById(dto.customerId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    this.validateItems(dto.items);
    this.validateOrderTotals(dto);

    let amountToPay = undefined;

    if (dto.useBalance && customer.balance > 0) {
      amountToPay =
        customer.balance >= dto.total ? dto.total : customer.balance;
    }

    const createDto: OrderDto = {
      id: undefined,
      total: dto.total,
      discount: dto.discount,
      subtotal: dto.subtotal,
      notes: dto.notes,
      customerId: dto.customerId,
      items: dto.items,
      sellerId,
      paid: false,
      status: OrderStatus.OPEN,
      type: OrderType.INSTALLMENT,
      createdAt: undefined,
      seller: undefined,
      customer: undefined,
      payments:
        dto.useBalance && customer.balance > 0
          ? [
              {
                id: undefined,
                installments: undefined,
                paidAt: undefined,
                netAmount: undefined,
                paymentMethod: PaymentMethod.CASH,
                change: 0,
                amount: amountToPay,
              } as OrderPaymentDto,
            ]
          : undefined,
    };

    const order = await this.orderRepository.create(createDto, sellerId);

    if (order && amountToPay) {
      await this.customerService.updateBalance(order.customerId, {
        balance: customer.balance - amountToPay,
      });
    }

    return order;
  }

  async updateOrder(orderId: number, dto: UpdateOrderDto): Promise<OrderDto> {
    const existingOrder = await this.orderRepository.findById(orderId);

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    const updateDto: OrderDto = {
      id: undefined,
      total: dto.total,
      discount: dto.discount,
      subtotal: dto.subtotal,
      notes: dto.notes,
      customerId: dto.customerId,
      items: dto.items,
      sellerId: undefined,
      paid: false,
      status: OrderStatus.OPEN,
      type: OrderType.INSTALLMENT,
      createdAt: undefined,
      seller: undefined,
      customer: undefined,
      payments: undefined,
    };

    const updatedOrder = await this.orderRepository.update(orderId, updateDto);

    return updatedOrder;
  }
}
