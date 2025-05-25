import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { UpdateBalanceDto } from '../dtos/update-balance.dto';
import { PrismaService } from 'src/common/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.customer.findMany({});
  }

  async findById(customerId: number, includeOrders = false) {
    return await this.prisma.customer.findUnique({
      include: {
        address: true,
        // orders: includeOrders,
      },
      where: {
        id: customerId,
      },
    });
  }

  async create(customer: CreateCustomerDto) {
    return await this.prisma.customer.create({
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
  }

  async update(customerId: number, customer: UpdateCustomerDto) {
    return await this.prisma.customer.update({
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
  }

  async updateBalance(customerId: number, updateBalanceDto: UpdateBalanceDto) {
    return await this.prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        balance: updateBalanceDto.balance,
      },
    });
  }

  async delete(customerId: number) {
    return await this.prisma.customer.delete({
      where: {
        id: customerId,
      },
    });
  }

  async deleteMany(customerIds: number[]) {
    return await this.prisma.customer.deleteMany({
      where: {
        id: {
          in: customerIds,
        },
      },
    });
  }
}
