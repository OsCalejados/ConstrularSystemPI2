import { CustomerRepository } from '../interfaces/customer.repository.interface';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { CustomerDto } from '../dtos/customer.dto';
import { Injectable } from '@nestjs/common';
import { UpdateBalanceDto } from '../dtos/update-balance.dto';

@Injectable()
export class InMemoryCustomerRepository implements CustomerRepository {
  constructor() {}

  public customers: CustomerDto[] = [];

  async findAll(): Promise<CustomerDto[]> {
    return this.customers;
  }

  async findById(
    customerId: number,
    options?: { includeAddress?: boolean; includeOrders?: boolean },
  ): Promise<CustomerDto> {
    const index = this.customers.findIndex((item) => item.id === customerId);

    if (index === -1) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }

    const customer = this.customers[index];

    return {
      ...customer,
      address: options?.includeAddress ? customer.address : undefined,
    };
  }

  async create(customer: CreateCustomerDto): Promise<CustomerDto> {
    let id = 1;

    if (this.customers.length > 0) {
      id = this.customers.at(-1).id + 1;
    }

    const createdCustomer: CustomerDto = {
      id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      balance: 0,
      address: {
        id,
        city: customer.city,
        neighborhood: customer.neighborhood,
        street: customer.street,
        number: customer.number,
        complement: customer.complement,
        reference: customer.reference,
      },
    };

    this.customers.push(createdCustomer);

    return createdCustomer;
  }

  async update(
    customerId: number,
    customer: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    const index = this.customers.findIndex((item) => item.id === customerId);

    if (index === -1) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }

    const existing = this.customers[index];

    const updatedCustomer: CustomerDto = {
      ...existing,
      name: customer.name ?? existing.name,
      email: customer.email ?? existing.email,
      phone: customer.phone ?? existing.phone,
      address: existing.address
        ? {
            ...existing.address,
            city: customer.city ?? existing.address.city,
            neighborhood:
              customer.neighborhood ?? existing.address.neighborhood,
            street: customer.street ?? existing.address.street,
            number: customer.number ?? existing.address.number,
            complement: customer.complement ?? existing.address.complement,
            reference: customer.reference ?? existing.address.reference,
          }
        : undefined,
    };

    this.customers[index] = updatedCustomer;

    return updatedCustomer;
  }

  async updateBalance(
    customerId: number,
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<CustomerDto> {
    const index = this.customers.findIndex((item) => item.id === customerId);

    if (index === -1) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }

    this.customers[index].balance = updateBalanceDto.balance;

    return this.customers[index];
  }

  async deleteById(customerId: number): Promise<CustomerDto> {
    const index = this.customers.findIndex((item) => item.id === customerId);

    if (index === -1) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }

    const [deletedCustomer] = this.customers.splice(index, 1);
    return deletedCustomer;
  }
}
