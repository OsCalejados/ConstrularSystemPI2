import { CustomerDto } from '../dtos/customer.dto';
import { Address, Customer } from '@prisma/client';
import { AddressMapper } from './address.mapper';

type CustomerWithAddress = Customer & {
  address?: Address | null | undefined;
};

export class CustomerMapper {
  static toDto(customer: CustomerWithAddress): CustomerDto {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      balance: customer.balance,
      address: customer.address
        ? AddressMapper.toDto(customer.address)
        : undefined,
    };
  }
}
