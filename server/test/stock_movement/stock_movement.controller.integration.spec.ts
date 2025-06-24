import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StartedTestContainer, GenericContainer, Wait } from 'testcontainers';
import { execSync } from 'child_process';

// Modules
import { AuthModule } from '@src/modules/auth/auth.module';
import { CustomerModule } from '@src/modules/customer/customer.module';
import { OrderModule } from '@src/modules/order/order.module';
import { ProductModule } from '@src/modules/product/product.module';
import { StockMovementModule } from '@src/modules/stock_movement/stock_movement.module';
import { UserModule } from '@src/modules/user/user.module';

// DTOs and Enums
import { CreateStockMovementDTO } from '@src/modules/stock_movement/dtos/create_stock_movement.dto';
import { MovementType } from '@src/common/enums/movement_type.enum';
import { Prisma } from '@prisma/client';
import { StockMovementController } from '@src/modules/stock_movement/controllers/stock_movement.controller';
import { AppException } from '@src/common/exceptions/app.exception';
import { MeasureUnit } from '@src/common/enums/measure-unit.enum'; // Importar MeasureUnit

describe('StockMovementController (Integration)', () => {
  let controller: StockMovementController;
  let prismaTestClient: PrismaClient;
  let container: StartedTestContainer;

  beforeAll(async () => {
    console.log(
      '[StockMovementController Integration] Starting PostgreSQL container...',
    );
    container = await new GenericContainer('postgres:latest')
      .withEnvironment({ POSTGRES_DB: 'test_db_stock_movement' })
      .withEnvironment({ POSTGRES_USER: 'test_user' })
      .withEnvironment({ POSTGRES_PASSWORD: 'test_password' })
      .withExposedPorts(5432) // Expondo a porta padrão do PostgreSQL
      .withWaitStrategy(
        Wait.forLogMessage('database system is ready to accept connections', 2),
      ) // Espera a mensagem de log
      .withStartupTimeout(180000) // Aumenta o tempo limite de inicialização para 3 minutos
      .start();
    console.log(
      '[StockMovementController Integration] PostgreSQL container started.',
    );

    const databaseUrl = `postgresql://test_user:test_password@${container.getHost()}:${container.getFirstMappedPort()}/test_db_stock_movement`;
    process.env.DATABASE_URL = databaseUrl;
    console.log(
      `[StockMovementController Integration] DATABASE_URL set to: ${databaseUrl}`,
    );

    console.log(
      '[StockMovementController Integration] Applying Prisma migrations...',
    );
    try {
      execSync('npx prisma migrate reset --force', {
        env: { ...process.env, DATABASE_URL: databaseUrl },
        stdio: 'inherit',
      });
      console.log(
        '[StockMovementController Integration] Prisma migrations applied successfully.',
      );
    } catch (error) {
      console.error(
        '[StockMovementController Integration] Failed to apply Prisma migrations:',
        error,
      );
      await container.stop();
      throw error;
    }

    prismaTestClient = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    });
    await prismaTestClient.$connect();
    console.log(
      '[StockMovementController Integration] Direct Prisma client connected.',
    );

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule, // AuthModule é necessário por causa do JwtAuthGuard global
        CustomerModule,
        UserModule,
        ProductModule,
        OrderModule,
        StockMovementModule,
      ],
    }).compile();
    console.log(
      '[StockMovementController Integration] NestJS testing module compiled.',
    );

    controller = module.get<StockMovementController>(StockMovementController);

    console.log(
      '[StockMovementController Integration] Controller instance obtained.',
    );
  }, 300000);

  beforeEach(async () => {
    // Clean up tables before each test
    await prismaTestClient.stockMovementItem.deleteMany({});
    await prismaTestClient.stockMovement.deleteMany({});
    await prismaTestClient.product.deleteMany({});
  });

  afterAll(async () => {
    await prismaTestClient?.$disconnect();
    await container?.stop();
    delete process.env.DATABASE_URL;
    console.log('[StockMovementController Integration] Teardown complete.');
  }, 120000);

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve registrar com sucesso uma entrada manual de múltiplos itens no estoque', async () => {
      // GIVEN
      const product1 = await prismaTestClient.product.create({
        data: {
          name: 'Parafuso Sextavado 1/4',
          brand: 'Brand',
          unit: MeasureUnit.UN,
          stockQuantity: 100.0,
          costPrice: 1,
          profitMargin: 1,
          profit: 1,
          salePrice: 2,
        },
      });
      const product2 = await prismaTestClient.product.create({
        data: {
          name: 'Cano soldável de 25mm',
          brand: 'Brand',
          unit: MeasureUnit.MT,
          stockQuantity: 25.0,
          costPrice: 1,
          profitMargin: 1,
          profit: 1,
          salePrice: 2,
        },
      });

      const createDto: CreateStockMovementDTO = {
        type: MovementType.IN,
        description: 'Recebimento de fornecedor',
        items: [
          { productId: product1.id, quantity: 50 },
          { productId: product2.id, quantity: 15 },
        ],
      };

      // WHEN
      const result = await controller.createStockMovement(createDto);

      console.log(result);

      // THEN
      expect(result.description).toBe('Recebimento de fornecedor');
      expect(result.items).toHaveLength(2);

      const updatedProduct1 = await prismaTestClient.product.findUnique({
        where: { id: product1.id },
      });
      const updatedProduct2 = await prismaTestClient.product.findUnique({
        where: { id: product2.id },
      });

      expect(updatedProduct1?.stockQuantity).toEqual(new Prisma.Decimal(150.0));
      expect(updatedProduct2?.stockQuantity).toEqual(new Prisma.Decimal(40.0));

      const movement = await prismaTestClient.stockMovement.findFirst();
      expect(movement).not.toBeNull();
      const movementItems = await prismaTestClient.stockMovementItem.findMany({
        where: { stockMovementId: movement!.id },
      });
      expect(movementItems).toHaveLength(2);
    });

    it('deve registrar com sucesso uma baixa (saída) manual de múltiplos itens do estoque', async () => {
      // GIVEN
      const product1 = await prismaTestClient.product.create({
        data: {
          name: 'Tinta Acrílica Branca',
          brand: 'Brand',
          unit: MeasureUnit.LT,
          stockQuantity: 20.0,
          costPrice: 1,
          profitMargin: 1,
          profit: 1,
          salePrice: 2,
        },
      });
      const product2 = await prismaTestClient.product.create({
        data: {
          name: 'Fio Elétrico 2.5mm',
          brand: 'Brand',
          unit: MeasureUnit.MT,
          stockQuantity: 50.0,
          costPrice: 1,
          profitMargin: 1,
          profit: 1,
          salePrice: 2,
        },
      });

      const createDto: CreateStockMovementDTO = {
        type: MovementType.OUT,
        description: 'Itens para uso em reparo interno',
        items: [
          { productId: product1.id, quantity: 2 },
          { productId: product2.id, quantity: 10 },
        ],
      };

      // WHEN
      const result = await controller.createStockMovement(createDto);

      // THEN
      expect(result.description).toBe('Itens para uso em reparo interno');
      expect(result.items).toHaveLength(2);

      const updatedProduct1 = await prismaTestClient.product.findUnique({
        where: { id: product1.id },
      });
      const updatedProduct2 = await prismaTestClient.product.findUnique({
        where: { id: product2.id },
      });

      expect(updatedProduct1?.stockQuantity).toEqual(new Prisma.Decimal(18.0));
      expect(updatedProduct2?.stockQuantity).toEqual(new Prisma.Decimal(40.0));

      const movement = await prismaTestClient.stockMovement.findFirst();
      expect(movement).not.toBeNull();
      const movementItems = await prismaTestClient.stockMovementItem.findMany({
        where: { stockMovementId: movement!.id },
      });
      expect(movementItems).toHaveLength(2);
    });

    it('deve lançar uma exceção ao tentar dar baixa com estoque insuficiente', async () => {
      // GIVEN
      const product1 = await prismaTestClient.product.create({
        data: {
          name: 'Tinta Acrílica Branca',
          brand: 'Brand',
          unit: MeasureUnit.LT,
          stockQuantity: 20.0,
          costPrice: 1,
          profitMargin: 1,
          profit: 1,
          salePrice: 2,
        },
      });
      const product2 = await prismaTestClient.product.create({
        data: {
          name: 'Pincel Cerdas Macias',
          brand: 'Brand',
          unit: MeasureUnit.UN,
          stockQuantity: 30.0,
          costPrice: 1,
          profitMargin: 1,
          profit: 1,
          salePrice: 2,
        },
      });

      const createDto: CreateStockMovementDTO = {
        type: MovementType.OUT,
        description: 'Tentativa de baixa com estoque insuficiente',
        items: [
          { productId: product1.id, quantity: 10 },
          { productId: product2.id, quantity: 35 }, // Insufficient stock
        ],
      };

      // WHEN & THEN
      await expect(controller.createStockMovement(createDto)).rejects.toThrow(
        new AppException(
          "A quantidade de saída para o item 'Pincel Cerdas Macias' é maior que o estoque disponível.",
          HttpStatus.BAD_REQUEST,
        ),
      );

      const p1 = await prismaTestClient.product.findUnique({
        where: { id: product1.id },
      });
      const p2 = await prismaTestClient.product.findUnique({
        where: { id: product2.id },
      });

      expect(p1?.stockQuantity).toEqual(new Prisma.Decimal(20.0)); // Unchanged
      expect(p2?.stockQuantity).toEqual(new Prisma.Decimal(30.0)); // Unchanged

      const movementCount = await prismaTestClient.stockMovement.count();
      expect(movementCount).toBe(0);
    });

    it('deve lançar AppException se a descrição estiver ausente para um movimento de saída', async () => {
      // GIVEN
      const product1 = await prismaTestClient.product.create({
        data: {
          name: 'Produto para Saída',
          brand: 'Brand',
          unit: MeasureUnit.UN,
          stockQuantity: 10.0,
          costPrice: 1,
          profitMargin: 1,
          profit: 1,
          salePrice: 2,
        },
      });

      const createDto: CreateStockMovementDTO = {
        type: MovementType.OUT,
        description: '', // Descrição ausente
        items: [{ productId: product1.id, quantity: 5 }],
      };

      // WHEN & THEN
      await expect(controller.createStockMovement(createDto)).rejects.toThrow(
        new AppException(
          'Justificativa obrigatória para saídas manuais.',
          HttpStatus.BAD_REQUEST,
        ),
      );

      const movementCount = await prismaTestClient.stockMovement.count();
      expect(movementCount).toBe(0);
    });
  });

  describe('getAllStockMovements', () => {
    it('deve retornar um array de movimentações de estoque', async () => {
      // GIVEN
      const product1 = await prismaTestClient.product.create({
        data: {
          name: 'Produto Movimentado 1',
          brand: 'Brand',
          unit: MeasureUnit.UN,
          stockQuantity: 10.0,
          costPrice: 1,
          profitMargin: 1,
          profit: 1,
          salePrice: 2,
        },
      });
      const product2 = await prismaTestClient.product.create({
        data: {
          name: 'Produto Movimentado 2',
          brand: 'Brand',
          unit: MeasureUnit.UN,
          stockQuantity: 20.0,
          costPrice: 1,
          profitMargin: 1,
          profit: 1,
          salePrice: 2,
        },
      });

      await controller.createStockMovement({
        type: MovementType.IN,
        description: 'Entrada de teste',
        items: [{ productId: product1.id, quantity: 5 }],
      });
      await controller.createStockMovement({
        type: MovementType.OUT,
        description: 'Saída de teste',
        items: [{ productId: product2.id, quantity: 10 }],
      });

      // WHEN
      const result = await controller.getAllStockMovements();

      // THEN
      expect(result).toHaveLength(2);
      expect(result.map((m) => m.type).sort()).toEqual(
        [MovementType.IN, MovementType.OUT].sort(),
      );
    });

    it('deve retornar um array vazio se não houver movimentações', async () => {
      // WHEN
      const result = await controller.getAllStockMovements();

      // THEN
      expect(result).toHaveLength(0);
    });

    it('deve retornar apenas movimentações de saída ao filtrar por tipo', async () => {
      // GIVEN
      const product1 = await prismaTestClient.product.create({
        data: {
          name: 'Produto Filtrado 1',
          brand: 'Brand',
          unit: MeasureUnit.UN,
          stockQuantity: 10.0,
          costPrice: 1,
          profitMargin: 1,
          profit: 1,
          salePrice: 2,
        },
      });
      const product2 = await prismaTestClient.product.create({
        data: {
          name: 'Produto Filtrado 2',
          brand: 'Brand',
          unit: MeasureUnit.UN,
          stockQuantity: 20.0,
          costPrice: 1,
          profitMargin: 1,
          profit: 1,
          salePrice: 2,
        },
      });

      await controller.createStockMovement({
        type: MovementType.IN,
        description: 'Entrada para filtro',
        items: [{ productId: product1.id, quantity: 5 }],
      });
      await controller.createStockMovement({
        type: MovementType.OUT,
        description: 'Saída para filtro',
        items: [{ productId: product2.id, quantity: 10 }],
      });

      // WHEN
      const result = await controller.getAllStockMovements(MovementType.OUT);

      // THEN
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(MovementType.OUT);
      expect(result[0].description).toBe('Saída para filtro');
    });
  });

  describe('getStockMovementById', () => {
    it('deve retornar uma movimentação de estoque pelo ID', async () => {
      // GIVEN
      const product1 = await prismaTestClient.product.create({
        data: {
          name: 'Produto para ID',
          brand: 'Brand',
          unit: MeasureUnit.UN,
          stockQuantity: 10.0,
          costPrice: 1,
          profitMargin: 1,
          profit: 1,
          salePrice: 2,
        },
      });

      const createdMovement = await controller.createStockMovement({
        type: MovementType.IN,
        description: 'Movimentação por ID',
        items: [{ productId: product1.id, quantity: 5 }],
      });

      // WHEN
      const result = await controller.getStockMovementById(createdMovement.id);

      // THEN
      expect(result).toBeDefined();
      expect(result.id).toBe(createdMovement.id);
      expect(result.description).toBe('Movimentação por ID');
    });

    it('deve lançar AppException se a movimentação não for encontrada', async () => {
      // WHEN & THEN
      await expect(controller.getStockMovementById(99999)).rejects.toThrow(
        new AppException('Stock movement not found.', HttpStatus.NOT_FOUND),
      );
    });
  });
});
