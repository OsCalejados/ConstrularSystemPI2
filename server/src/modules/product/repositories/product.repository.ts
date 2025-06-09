/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/common/services/prisma.service';
import { IProductRepository } from '../interfaces/product.repository.interface';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async getAllByName(productName: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        name: {
          contains: productName,
          mode: 'insensitive',
        },
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findById(productId: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async update(
    productId: number,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product | null> {
    return this.prisma.product
      .update({
        where: {
          id: productId,
        },
        data,
      })
      .catch(() => null);
  }

  async delete(productId: number): Promise<void> {
    await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }

  async existsByName(productName: string): Promise<boolean> {
    const product = await this.prisma.product.findFirst({
      where: {
        name: productName,
      },
    });
    return !!product;
  }
}
