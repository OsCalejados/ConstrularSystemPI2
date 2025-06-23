import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StartedTestContainer, GenericContainer, Wait } from 'testcontainers';
import { execSync } from 'child_process';
import * as request from 'supertest';

// Modules
import { AppModule } from '@src/app.module';

// DTOs and Enums
import { CreateStockMovementDTO } from '@src/modules/stock_movement/dtos/create_stock_movement.dto';
import { MovementType } from '@src/common/enums/movement_type.enum';
import { Decimal } from '@prisma/client/runtime/library';
import { StockMovementController } from '@src/modules/stock_movement/controllers/stock_movement.controller';

describe('StockMovementController (Integration)', () => {
  let app: INestApplication;
  let prismaTestClient: PrismaClient;
  let container: StartedTestContainer;

  beforeAll(async () => {
    container = await new GenericContainer('postgres:17')
      .withEnvironment({ POSTGRES_DB: 'test_db_stock_movement_ctrl' })
      .withEnvironment({ POSTGRES_USER: 'test_user' })
      .withEnvironment({ POSTGRES_PASSWORD: 'test_password' })
      .withExposedPorts(5432)
      .withWaitStrategy(
        Wait.forLogMessage('database system is ready to accept connections', 2),
      )
      .start();

    const databaseUrl = `postgresql://test_user:test_password@${container.getHost()}:${container.getFirstMappedPort()}/test_db_stock_movement_ctrl`;
    process.env.DATABASE_URL = databaseUrl;

    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });

    prismaTestClient = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    });
    await prismaTestClient.$connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  }, 300000);

  beforeEach(async () => {
    await prismaTestClient.stockMovementItem.deleteMany({});
    await prismaTestClient.stockMovement.deleteMany({});
    await prismaTestClient.product.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
    await prismaTestClient?.$disconnect();
    await container?.stop();
    delete process.env.DATABASE_URL;
  }, 300000);

  it('should be defined', () => {
    const controller = app.get(StockMovementController);
    expect(controller).toBeDefined();
  });

  describe('POST /stockMovements - Create Stock Movement', () => {
    it('Cenário: Registro bem-sucedido de uma entrada manual de múltiplos itens do estoque', async () => {
      // GIVEN
      const product1 = await prismaTestClient.product.create({
        data: {
          name: 'Parafuso Sextavado 1/4',
          brand: 'Brand',
          unit: 'UN',
          stockQuantity: 100,
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
          unit: 'Metro',
          stockQuantity: 25,
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

      // WHEN & THEN
      await request(app.getHttpServer())
        .post('/stockMovements')
        .send(createDto)
        .expect(HttpStatus.CREATED)
        .then(async (response) => {
          expect(response.body.description).toBe('Recebimento de fornecedor');
          expect(response.body.items).toHaveLength(2);

          const updatedProduct1 = await prismaTestClient.product.findUnique({
            where: { id: product1.id },
          });
          const updatedProduct2 = await prismaTestClient.product.findUnique({
            where: { id: product2.id },
          });

          expect(updatedProduct1?.stockQuantity).toEqual(new Decimal(150));
          expect(updatedProduct2?.stockQuantity).toEqual(new Decimal(40));

          const movement = await prismaTestClient.stockMovement.findFirst();
          expect(movement).not.toBeNull();
          const movementItems =
            await prismaTestClient.stockMovementItem.findMany({
              where: { stockMovementId: movement!.id },
            });
          expect(movementItems).toHaveLength(2);
        });
    });

    it('Cenário: Tentativa de baixa de estoque com quantidade insuficiente para um dos itens', async () => {
      // GIVEN
      const product1 = await prismaTestClient.product.create({
        data: {
          name: 'Tinta Acrílica Branca',
          brand: 'Brand',
          unit: 'Litros',
          stockQuantity: 20,
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
          unit: 'Unidade',
          stockQuantity: 30,
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
      await request(app.getHttpServer())
        .post('/stockMovements')
        .send(createDto)
        .expect(HttpStatus.BAD_REQUEST)
        .then(async (response) => {
          expect(response.body.message).toBe(
            "A quantidade de saída para o item 'Pincel Cerdas Macias' é maior que o estoque disponível.",
          );

          const p1 = await prismaTestClient.product.findUnique({
            where: { id: product1.id },
          });
          const p2 = await prismaTestClient.product.findUnique({
            where: { id: product2.id },
          });

          expect(p1?.stockQuantity).toEqual(new Decimal(20)); // Unchanged
          expect(p2?.stockQuantity).toEqual(new Decimal(30)); // Unchanged

          const movementCount = await prismaTestClient.stockMovement.count();
          expect(movementCount).toBe(0);
        });
    });
  });
});
