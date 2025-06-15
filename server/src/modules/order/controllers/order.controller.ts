import { UpdateStatusDto } from '../dtos/update-status';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { UpdateNotesDto } from '../dtos/update-notes';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CurrentUserId } from '@src/common/decorators/current-user-id.decorator';
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
import { FindOrderOptionsDto } from '../dtos/find-order-options.dto';

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
}
