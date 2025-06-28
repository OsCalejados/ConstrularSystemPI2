import { CustomerRepository } from '../interfaces/customer.repository.interface';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { UpdateBalanceDto } from '../dtos/update-balance.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FindCustomerOptions } from '../interfaces/find-customer-options.interface';

@Injectable()
export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async getAllCustomers() {
    const customers = await this.customerRepository.findAll();
    return customers;
  }

  async getCustomerById(customerId: number, options?: FindCustomerOptions) {
    const customer = await this.customerRepository.findById(
      customerId,
      options,
    );

    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }

    return customer;
  }

  async createCustomer(customer: CreateCustomerDto) {
    if (!customer.name) {
      throw new BadRequestException({
        message: 'Customer name must be defined',
        code: 'CUSTOMER_ALREADY_EXISTS',
      });
    }

    const createdCustomer = await this.customerRepository.create(customer);

    return createdCustomer;
  }

  async updateCustomer(customerId: number, customer: UpdateCustomerDto) {
    const existingCustomer = await this.customerRepository.findById(customerId);

    if (!existingCustomer) {
      throw new NotFoundException(`Customer not found`);
    }

    if (!customer.name) {
      throw new BadRequestException({
        message: 'Customer name must be defined',
        code: 'CUSTOMER_ALREADY_EXISTS',
      });
    }

    const updatedCustomer = await this.customerRepository.update(
      customerId,
      customer,
    );

    return updatedCustomer;
  }

  async updateBalance(
    customerId: number,
    updateBalanceDto: UpdateBalanceDto,
    tx?: Prisma.TransactionClient,
  ) {
    const existingCustomer = await this.customerRepository.findById(customerId);

    if (!existingCustomer) {
      throw new NotFoundException(`Customer not found`);
    }

    const updatedCustomer = await this.customerRepository.updateBalance(
      customerId,
      updateBalanceDto,
      tx,
    );

    return updatedCustomer;
  }

  async deleteCustomer(customerId: number) {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }

    await this.customerRepository.deleteById(customerId);
  }
}
