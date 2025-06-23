import { FindOrderOptionsDto } from '../dtos/find-order-options.dto';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { UpdateNotesDto } from '../dtos/update-notes';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CurrentUserId } from '@src/common/decorators/current-user-id.decorator';
import { OrderService } from '../services/order.service';
import {
  Controller,
  Delete,
  Param,
  Query,
  Body,
  Post,
  Put,
  Get,
  ParseIntPipe,
} from '@nestjs/common';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async getAllOrders(@Query() query: FindOrderOptionsDto) {
    return await this.orderService.getAllOrders({ ...query });
  }

  @Get(':id')
  async getOrderById(
    @Param('id') orderId: string,
    @Query() query: FindOrderOptionsDto,
  ) {
    const id = parseInt(orderId);

    return await this.orderService.getOrderById(id, {
      ...query,
    });
  }

  @Get('customer/:id')
  async getOrdersByCustomer(
    @Param('id') customerId: string,
    @Query() query: FindOrderOptionsDto,
  ) {
    const id = parseInt(customerId);

    return await this.orderService.getOrdersByCustomer(id, { ...query });
  }

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUserId() userId: number,
  ) {
    return await this.orderService.createOrder(createOrderDto, userId);
  }

  @Put(':id')
  async updateOrder(
    @Param('id') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const id = parseInt(orderId);

    return await this.orderService.updateOrder(id, updateOrderDto);
  }

  @Put(':id/notes')
  async updateNotes(
    @Param('id') orderId: string,
    @Body() updateNotesDto: UpdateNotesDto,
  ) {
    const id = parseInt(orderId);

    return await this.orderService.updateNotes(id, updateNotesDto);
  }

  @Delete(':id')
  async deleteOrder(@Param('id', ParseIntPipe) orderId: number) {
    await this.orderService.deleteOrder(orderId);
  }

  // =====================================
  // Mover para módulo Payment futuramente
  // =====================================
  @Post(':id/payments')
  async addPayment(
    @Param('id') orderId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    const id = parseInt(orderId);

    return await this.orderService.addPayment(id, createPaymentDto);
  }

  // =====================================
  // Mover para módulo Payment futuramente
  // =====================================
  @Delete(':orderId/payments/:paymentId')
  async deletePayment(
    @Param('orderId') orderId: string,
    @Param('paymentId') paymentId: string,
  ) {
    const orderIdParsed = parseInt(orderId);
    const paymentIdParsed = parseInt(paymentId);

    return await this.orderService.deletePayment(
      orderIdParsed,
      paymentIdParsed,
    );
  }
}
