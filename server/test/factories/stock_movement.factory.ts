import { Product, StockMovementItem } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateStockMovementDTO } from '../../src/modules/stock_movement/dtos/create_stock_movement.dto';
import { IStockMovementRepository } from '../../src/modules/stock_movement/interfaces/stock_movement.repository.interface';
import { StockMovementWithDetails } from '../../src/modules/stock_movement/types/stock_movement.types';
import { MovementType } from '@src/common/enums/movement_type.enum';

export class StockMovementFactory {
  /**
   * Cria um DTO para a criação de uma movimentação de estoque.
   * @param overrides - Objeto para sobrescrever os valores padrão.
   */
  static createDto(
    overrides: Partial<CreateStockMovementDTO> = {},
  ): CreateStockMovementDTO {
    return {
      type: MovementType.IN,
      description: 'Entrada de teste via factory',
      items: [
        {
          productId: 1,
          quantity: 10,
        },
      ],
      ...overrides,
    };
  }

  /**
   * Cria um objeto de movimentação de estoque completo, com itens e produtos,
   * ideal para ser usado como mock em testes de serviço e repositório.
   * @param override - Objeto para sobrescrever os valores padrão.
   */
  static createWithDetails(
    overrides: Partial<StockMovementWithDetails> = {},
  ): StockMovementWithDetails {
    const movementId = overrides.id || 1;

    const product: Product = {
      id: 1,
      name: 'Produto de Teste',
      brand: 'Marca Teste',
      unit: 'UN',
      stockQuantity: new Decimal(50),
      costPrice: new Decimal('10.00'),
      profitMargin: new Decimal('0.2'),
      profit: new Decimal('2.00'),
      salePrice: new Decimal('12.00'),
      createdAt: new Date(),
    };

    const item: StockMovementItem & { product: Product } = {
      id: 101,
      quantity: new Decimal(5),
      stockMovementId: movementId,
      productId: product.id,
      product: product,
    };

    const defaultMovement: StockMovementWithDetails = {
      id: movementId,
      type: MovementType.IN.toString(),
      description: 'Movimentação de teste',
      createdAt: new Date(),
      items: [item],
    };

    return { ...defaultMovement, ...overrides };
  }

  static createMockRepository(
    mocks: Partial<IStockMovementRepository> = {},
  ): IStockMovementRepository {
    const defaultMovement = StockMovementFactory.createWithDetails();
    return {
      create: jest.fn().mockResolvedValue(defaultMovement),
      findAll: jest.fn().mockResolvedValue([defaultMovement]),
      findById: jest.fn().mockResolvedValue(defaultMovement),
      delete: jest.fn().mockResolvedValue(undefined),
      ...mocks,
    } as unknown as IStockMovementRepository;
  }
}
