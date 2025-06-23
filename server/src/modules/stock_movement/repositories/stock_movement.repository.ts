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

  async findAll(): Promise<StockMovementWithDetails[]> {
    return this.prisma.stockMovement.findMany({
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
    data: Prisma.StockMovementCreateInput,
  ): Promise<StockMovementWithDetails> {
    return this.prisma.stockMovement.create({
      data,
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
