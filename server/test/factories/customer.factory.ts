import { CreateCustomerDto } from 'src/modules/customer/dtos/create-customer.dto';
import { UpdateCustomerDto } from 'src/modules/customer/dtos/update-customer.dto';
import { UpdateBalanceDto } from 'src/modules/customer/dtos/update-balance.dto';

export class CustomerFactory {
  static createCustomer(
    overrides: Partial<CreateCustomerDto> = {},
  ): CreateCustomerDto {
    return {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      city: 'Test City',
      neighborhood: 'Test Neighborhood',
      street: 'Test Street',
      number: '123',
      complement: 'Apt 1',
      reference: 'Near Park',
      ...overrides,
    };
  }

  static updateCustomer(
    overrides: Partial<UpdateCustomerDto> = {},
  ): UpdateCustomerDto {
    return {
      name: 'Updated Name',
      email: 'updated@example.com',
      phone: '987654321',
      city: 'Updated City',
      neighborhood: 'Updated Neighborhood',
      street: 'Updated Street',
      number: 'Updated 123',
      complement: 'Updated Apt 1',
      reference: 'Updated Near Park',
      ...overrides,
    };
  }

  static updateBalance(balance: number): UpdateBalanceDto {
    return {
      balance,
    };
  }
}
