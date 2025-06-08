import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { UpdateBalanceDto } from '../dtos/update-balance.dto';
import { CustomerDto } from '../dtos/customer.dto';

type FindCustomerOptions = {
  includeAddress?: boolean;
  includeOrders?: boolean;
};

export abstract class CustomerRepository {
  abstract create(customer: CreateCustomerDto): Promise<CustomerDto>;

  abstract update(
    customerId: number,
    customer: UpdateCustomerDto,
  ): Promise<CustomerDto>;

  abstract updateBalance(
    customerId: number,
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<CustomerDto>;

  abstract findAll(): Promise<CustomerDto[]>;

  abstract findById(
    customerId: number,
    options?: FindCustomerOptions,
  ): Promise<CustomerDto>;

  abstract deleteById(customerId: number): Promise<CustomerDto>;
}
