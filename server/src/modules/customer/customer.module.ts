import { PrismaCustomerRepository } from './repositories/prisma-customer.repository';
import { CustomerRepository } from './interfaces/customer.repository.interface';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    PrismaService,
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
  ],
})
export class CustomerModule {}
