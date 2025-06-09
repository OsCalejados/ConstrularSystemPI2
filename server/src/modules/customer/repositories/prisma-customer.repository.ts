import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { UpdateBalanceDto } from '../dtos/update-balance.dto';
import { PrismaService } from '@src/common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../interfaces/customer.repository.interface';
import { CustomerMapper } from '../mappers/customer.mapper';
import { CustomerDto } from '../dtos/customer.dto';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CustomerDto[]> {
    const customers = await this.prisma.customer.findMany({});

    return customers.map((c) => CustomerMapper.toDto(c));
  }

  async findById(
    customerId: number,
    options?: { includeAddress?: boolean; includeOrders?: boolean },
  ): Promise<CustomerDto> {
    const customer = await this.prisma.customer.findUnique({
      include: {
        address: options.includeAddress,
      },
      where: {
        id: customerId,
      },
    });

    return CustomerMapper.toDto(customer);
  }

  async create(customer: CreateCustomerDto): Promise<CustomerDto> {
    const createdCustomer = await this.prisma.customer.create({
      data: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: {
          create: {
            city: customer.city,
            complement: customer.complement,
            neighborhood: customer.neighborhood,
            reference: customer.reference,
            street: customer.street,
            number: customer.number,
          },
        },
      },
    });

    return CustomerMapper.toDto(createdCustomer);
  }

  async update(
    customerId: number,
    customer: UpdateCustomerDto,
  ): Promise<CustomerDto> {
    const updatedCustomer = await this.prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: {
          update: {
            city: customer.city,
            complement: customer.complement,
            neighborhood: customer.neighborhood,
            reference: customer.reference,
            street: customer.street,
            number: customer.number,
          },
        },
      },
    });

    return CustomerMapper.toDto(updatedCustomer);
  }

  async updateBalance(
    customerId: number,
    updateBalanceDto: UpdateBalanceDto,
  ): Promise<CustomerDto> {
    const updatedCustomer = await this.prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        balance: updateBalanceDto.balance,
      },
    });

    return CustomerMapper.toDto(updatedCustomer);
  }

  async deleteById(customerId: number): Promise<CustomerDto> {
    const deletedCustomer = await this.prisma.customer.delete({
      where: {
        id: customerId,
      },
    });

    return CustomerMapper.toDto(deletedCustomer);
  }
}
