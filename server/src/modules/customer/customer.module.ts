import { CustomerRepository } from './repositories/customer.repository';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository, PrismaService],
})
export class CustomerModule {}
