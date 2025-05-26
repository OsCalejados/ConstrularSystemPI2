import { CustomerRepository } from 'src/customer/repositories/customer.repository';
import { OrderRepository } from './repositories/order.repository';
import { OrderController } from './controllers/order.controller';
import { PrismaService } from 'src/common/services/prisma.service';
import { OrderService } from './services/order.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [CustomerRepository, OrderRepository, PrismaService, OrderService],
})
export class OrderModule {}
