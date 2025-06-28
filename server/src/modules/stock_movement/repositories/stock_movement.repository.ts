/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/common/services/prisma.service';
import {
  Product,
  Prisma,
  StockMovement,
  StockMovementItem,
} from '@prisma/client';
import { IStockMovementRepository } from '../interfaces/stock_movement.repository.interface';
import { StockMovementWithDetails } from '../types/stock_movement.types';
import { MovementType } from '@src/common/enums/movement_type.enum';
import { CreateStockMovementDTO } from '../dtos/create_stock_movement.dto';

@Injectable()
export class StockMovementRepository implements IStockMovementRepository {
  constructor(private prisma: PrismaService) {
    this.prisma = prisma;
  }

  async delete(stockMovementId: number): Promise<StockMovement> {
    const deletedMovement = await this.prisma.stockMovement.delete({
      where: {
        id: stockMovementId,
      },
    });
    return deletedMovement;
  }

  async findAll(type?: MovementType): Promise<StockMovementWithDetails[]> {
    const where: Prisma.StockMovementWhereInput = {};

    if (type) {
      where.type = type.toString();
    }

    return this.prisma.stockMovement.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findById(
    stockMovementId: number,
  ): Promise<StockMovementWithDetails | null> {
    return this.prisma.stockMovement.findUnique({
      where: {
        id: stockMovementId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async create(
    data: CreateStockMovementDTO,
    tx?: Prisma.TransactionClient,
  ): Promise<StockMovementWithDetails> {
    const prisma = tx || this.prisma;
    return prisma.stockMovement.create({
      data: {
        type: data.type,
        description: data.description,
        items: {
          create: data.items.map((item) => ({
            quantity: item.quantity,
            productId: item.productId,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
