/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppException } from '@src/common/exceptions/app.exception';
import { IStockMovementRepository } from '../interfaces/stock_movement.repository.interface';
import { IStockMovementService } from '../interfaces/stock_movement.service.interface';
import { CreateStockMovementDTO } from '../dtos/create_stock_movement.dto';
import { StockMovementDTO } from '../dtos/stock_movement.dto';
import { IProductService } from '@src/modules/product/interfaces/product.service.interface';
import { StockMovementMapper } from '../mappers/stock_movement.mapper';
import { MovementType } from '@src/common/enums/movement_type.enum';
import { PrismaService } from '@src/common/services/prisma.service';
import { async } from 'rxjs';

@Injectable()
export class StockMovementService implements IStockMovementService {
  constructor(
    @Inject('IStockMovementRepository')
    private stockMovementRepository: IStockMovementRepository,
    @Inject('IProductService')
    private productService: IProductService,
    private readonly prisma: PrismaService,
  ) {}

  async getAllStockMovements(type?: MovementType): Promise<StockMovementDTO[]> {
    const movements = await this.stockMovementRepository.findAll(type);
    return movements.map(StockMovementMapper.toDto);
  }
  async getStockMovementById(
    stockMovementId: number,
  ): Promise<StockMovementDTO | null> {
    const movement =
      await this.stockMovementRepository.findById(stockMovementId);
    if (!movement) {
      throw new NotFoundException('Stock movement not found.');
    }
    return StockMovementMapper.toDto(movement);
  }

  async createStockMovement(
    data: CreateStockMovementDTO,
  ): Promise<StockMovementDTO> {
    if (data.type === MovementType.OUT && !data.description?.trim()) {
      throw new AppException(
        'Justificativa obrigatória para saídas manuais.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const movement = await this.prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new AppException(
            `Produto com ID ${item.productId} não encontrado.`,
            HttpStatus.NOT_FOUND,
          );
        }

        let newStockQuantity: number;
        const currentStock = Number(product.stockQuantity);
        const movementQuantity = item.quantity;

        if (data.type === MovementType.IN) {
          newStockQuantity = currentStock + movementQuantity;
        } else {
          // OUT
          if (currentStock < movementQuantity) {
            throw new AppException(
              `A quantidade de saída para o item '${product.name}' é maior que o estoque disponível.`,
              HttpStatus.BAD_REQUEST,
            );
          }
          newStockQuantity = currentStock - movementQuantity;
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: newStockQuantity },
        });
      }

      return await this.stockMovementRepository.create(data, tx as any);
    });
    console.log(movement);
    return StockMovementMapper.toDto(movement);
  }
  async deleteStockMovement(stockMovementId: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
