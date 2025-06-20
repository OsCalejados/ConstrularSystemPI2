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

    const customer = this.customerService.getCustomerById(dto.customerId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    this.validateItems(dto.items);
    this.validateOrderTotals(dto);

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
      payments: undefined,
    };

    const order = await this.orderRepository.create(createDto, sellerId);

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
