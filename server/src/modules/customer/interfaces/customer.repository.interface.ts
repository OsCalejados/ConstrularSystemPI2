import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { UpdateBalanceDto } from '../dtos/update-balance.dto';
import { CustomerDto } from '../dtos/customer.dto';
import { Prisma } from '@prisma/client';
import { FindCustomerOptions } from './find-customer-options.interface';

export abstract class CustomerRepository {
  abstract create(customer: CreateCustomerDto): Promise<CustomerDto>;

  abstract update(
    customerId: number,
    customer: UpdateCustomerDto,
  ): Promise<CustomerDto>;

  abstract updateBalance(
    customerId: number,
    updateBalanceDto: UpdateBalanceDto,
    tx?: Prisma.TransactionClient,
  ): Promise<CustomerDto>;

  abstract findAll(): Promise<CustomerDto[]>;

  abstract findById(
    customerId: number,
    options?: FindCustomerOptions,
  ): Promise<CustomerDto>;

  abstract deleteById(customerId: number): Promise<CustomerDto>;
}
