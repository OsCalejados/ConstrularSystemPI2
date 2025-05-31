import { DeleteOrdersDto } from '../dtos/delete-orders.dto';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { OrderService } from '../services/order.service';
import {
  Controller,
  Delete,
  Param,
  Body,
  Post,
  Put,
  Get,
  Query,
} from '@nestjs/common';
import { UpdateStatusDto } from '../dtos/update-status';
import { UpdateNotesDto } from '../dtos/update-notes';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async getAllOrders() {
    return await this.orderService.getAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: string) {
    const id = parseInt(orderId);

    return await this.orderService.getOrderById(id);
  }

  @Get('customer/:id')
  async getOrdersByCustomer(
    @Param('id') customerId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('status') status?: string,
  ) {
    const id = parseInt(customerId);
    const pageNumber = page ? parseInt(page) : 1;
    const pageSizeNumber = pageSize ? parseInt(pageSize) : 12;

    return await this.orderService.getOrdersByCustomer(
      id,
      pageNumber,
      pageSizeNumber,
      status,
    );
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
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

  @Put(':id/status')
  async updateStatus(
    @Param('id') orderId: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    const id = parseInt(orderId);

    return await this.orderService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') orderId: string) {
    const id = parseInt(orderId);

    await this.orderService.deleteOrder(id);
  }

  @Delete()
  async deleteOrders(@Body() deleteOrdersDto: DeleteOrdersDto) {
    const { orderIds } = deleteOrdersDto;

    return await this.orderService.deleteOrders(orderIds);
  }
}
