import { CustomerRepository } from 'src/customer/repositories/customer.repository';
import { OrderRepository } from './repositories/order.repository';
import { OrderController } from './controllers/Order.controller';
import { ItemRepository } from 'src/item/repositories/item.repository';
import { PrismaService } from 'src/common/services/prisma.service';
import { OrderService } from './services/order.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    CustomerRepository,
    OrderRepository,
    ItemRepository,
    PrismaService,
    OrderService,
  ],
})
export class OrderModule {}
