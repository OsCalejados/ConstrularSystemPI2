/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppException } from '@src/common/exceptions/app.exception';
import { IStockMovementRepository } from '../interfaces/stock_movement.repository.interface';
import { IStockMovementService } from '../interfaces/stock_movement.service.interface';
import { CreateStockMovementDTO } from '../dtos/create_stock_movement.dto';
import { StockMovementDTO } from '../dtos/stock_movement.dto';

@Injectable()
export class StockMovementService implements IStockMovementService {
  constructor(
    @Inject('IStockMovementRepository')
    private stockMovementRepository: IStockMovementRepository,
  ) {
    this.stockMovementRepository = stockMovementRepository;
  }

  async getAllStockMovements(): Promise<StockMovementDTO[]> {
    throw new Error('Method not implemented.');
  }
  async getStockMovementById(
    stockMovementId: number,
  ): Promise<StockMovementDTO | null> {
    throw new Error('Method not implemented.');
  }
  async createStockMovement(
    data: CreateStockMovementDTO,
  ): Promise<StockMovementDTO> {
    throw new Error('Method not implemented.');
  }
  async deleteStockMovement(stockMovementId: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
