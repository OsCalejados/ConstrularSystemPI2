import { CustomerRepository } from '../interfaces/customer.repository.interface';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { UpdateBalanceDto } from '../dtos/update-balance.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async getAllCustomers() {
    const customers = await this.customerRepository.findAll();
    return customers;
  }

  async getCustomerById(customerId: number, includeAddress: boolean) {
    const customer = await this.customerRepository.findById(customerId, {
      includeAddress: includeAddress,
    });

    if (!customer) {
      throw new Error(`Customer not found`);
    }

    return customer;
  }

  async createCustomer(customer: CreateCustomerDto) {
    if (!customer.name) {
      throw new Error('Customer name must be defined');
    }

    const createdCustomer = await this.customerRepository.create(customer);

    return createdCustomer;
  }

  async updateCustomer(customerId: number, customer: UpdateCustomerDto) {
    const existingCustomer = await this.customerRepository.findById(customerId);

    if (!existingCustomer) {
      throw new Error(`Customer not found`);
    }

    if (!customer.name) {
      throw new Error('Customer name must be defined');
    }

    const updatedCustomer = await this.customerRepository.update(
      customerId,
      customer,
    );

    return updatedCustomer;
  }

  async updateBalance(customerId: number, updateBalanceDto: UpdateBalanceDto) {
    const existingCustomer = await this.customerRepository.findById(customerId);

    if (!existingCustomer) {
      throw new Error(`Customer not found`);
    }

    const updatedCustomer = await this.customerRepository.updateBalance(
      customerId,
      updateBalanceDto,
    );

    return updatedCustomer;
  }

  async deleteCustomer(customerId: number) {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new Error(`Customer not found`);
    }

    await this.customerRepository.deleteById(customerId);
  }
}
