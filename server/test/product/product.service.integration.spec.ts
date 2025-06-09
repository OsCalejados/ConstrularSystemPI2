/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/common/services/prisma.service';
import { StartedTestContainer, GenericContainer, Wait } from 'testcontainers';
import { execSync } from 'child_process';
import { PrismaClient, Product, Order } from '@prisma/client'; // Adicionado Order para tipagem do mock
import { HttpStatus } from '@nestjs/common';

// Implementações Reais
import { ProductService } from '@src/modules/product/services/product.service';
import { ProductRepository } from '@src/modules/product/repositories/product.repository';
import { OrderService } from '@src/modules/order/services/order.service';
import { OrderRepository } from '@src/modules/order/repositories/order.repository';
import { IOrderService } from '@src/modules/order/interfaces/order.service.interface'; // Importar a interface
import { CustomerRepository } from '@src/modules/customer/interfaces/customer.repository.interface';
import { PrismaCustomerRepository } from '@src/modules/customer/repositories/prisma-customer.repository';

// DTOs
import { CreateProductDto } from '@src/modules/product/dtos/create-product.dto';
import { UpdateProductDto } from '@src/modules/product/dtos/update-product.dto';
import { AppException } from '@src/common/exceptions/app.exception';
import { OrderStatus } from '@src/common/enums/order-status.enum';
import { MeasureUnit } from '@src/common/enums/measure-unit.enum';
import { ProductDto } from '@src/modules/product/dtos/product.dto';

describe('ProductService (Integration)', () => {
  let productService: ProductService;
  let orderRepository: OrderRepository; // Para setup de pedidos
  let customerRepository: CustomerRepository; // Para setup de clientes
  let prismaTestClient: PrismaClient; // Cliente Prisma direto para setup/teardown
  let container: StartedTestContainer;
  let orderServiceInstance: IOrderService; // Para mockar o OrderService, usar a interface

  const baseCreateDto: CreateProductDto = {
    name: 'Testable Product',
    brand: 'Test Brand',
    unit: MeasureUnit.UN,
    stockQuantity: 100,
    costPrice: 50,
    profitMargin: 0.2,
    profit: 10, // 50 * 0.2
    salePrice: 60, // 50 + 10
  };

  beforeAll(async () => {
    console.log(
      '[ProductService Integration] Starting PostgreSQL container...',
    );
    container = await new GenericContainer('postgres:17') // Use a versão mais recente ou a de sua preferência
      .withEnvironment({ POSTGRES_DB: 'test_db_product_service' })
      .withEnvironment({ POSTGRES_USER: 'test_user' })
      .withEnvironment({ POSTGRES_PASSWORD: 'test_password' })
      .withExposedPorts(5432) // Expor a porta padrão do PostgreSQL
      .withWaitStrategy(
        Wait.forLogMessage('database system is ready to accept connections', 2),
      )
      .start();
    console.log('[ProductService Integration] PostgreSQL container started.');

    const databaseUrl = `postgresql://test_user:test_password@${container.getHost()}:${container.getFirstMappedPort()}/test_db_product_service`;
    process.env.DATABASE_URL = databaseUrl;
    console.log(
      `[ProductService Integration] DATABASE_URL set to: ${databaseUrl}`,
    );

    console.log('[ProductService Integration] Applying Prisma migrations...');
    try {
      execSync('npx prisma migrate deploy', {
        env: { ...process.env, DATABASE_URL: databaseUrl },
        stdio: 'inherit',
      });
      console.log(
        '[ProductService Integration] Prisma migrations applied successfully.',
      );
    } catch (error) {
      console.error(
        '[ProductService Integration] Failed to apply Prisma migrations:',
        error,
      );
      await container.stop();
      throw error;
    }

    prismaTestClient = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    });
    await prismaTestClient.$connect();
    console.log('[ProductService Integration] Direct Prisma client connected.');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService, // A classe que estamos testando
        PrismaService, // Usado por todos os repositórios Prisma
        { provide: 'IProductRepository', useClass: ProductRepository },
        { provide: 'IOrderService', useClass: OrderService },
        OrderRepository, // Dependência do OrderService
        { provide: CustomerRepository, useClass: PrismaCustomerRepository }, // Dependência do OrderService
      ],
    }).compile();
    console.log('[ProductService Integration] NestJS testing module compiled.');

    productService = module.get<ProductService>(ProductService);
    // Obter instâncias para setup, se necessário (já que o OrderRepository foi refatorado)
    orderServiceInstance = module.get<IOrderService>('IOrderService'); // Obtém a instância real do OrderService usando o token
    orderRepository = module.get<OrderRepository>(OrderRepository);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);

    console.log('[ProductService Integration] Service instances obtained.');
  }, 300000); // Timeout aumentado para setup completo

  beforeEach(async () => {
    // Limpar dados em ordem reversa de dependência de FKs
    await prismaTestClient.orderItem.deleteMany({});
    await prismaTestClient.order.deleteMany({});
    await prismaTestClient.product.deleteMany({});
    await prismaTestClient.customer.deleteMany({});
    await prismaTestClient.address.deleteMany({});
    // Adicione outras tabelas se necessário
  });

  afterAll(async () => {
    await prismaTestClient?.$disconnect();
    await container?.stop();
    delete process.env.DATABASE_URL;
    // O PrismaService injetado nos serviços será desconectado pelo NestJS ao destruir o módulo
  }, 60000); // Timeout aumentado para o teardown

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const result = await productService.createProduct(baseCreateDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(baseCreateDto.name);
      expect(result.id).toBeGreaterThan(0);

      const dbProduct = await prismaTestClient.product.findUnique({
        where: { id: result.id },
      });
      expect(dbProduct).not.toBeNull();
      expect(dbProduct?.name).toBe(baseCreateDto.name);
    });

    it('should throw AppException if product with the same name already exists', async () => {
      await productService.createProduct({
        ...baseCreateDto,
      }); // Cria o primeiro
      await expect(
        productService.createProduct({
          ...baseCreateDto,
          createdAt: new Date(),
        } as any),
      ).rejects.toThrow(AppException); // Tenta criar de novo
      try {
        await productService.createProduct({
          ...baseCreateDto,
          createdAt: new Date(),
        } as any);
      } catch (e) {
        expect(e.status).toBe(HttpStatus.BAD_REQUEST);
        expect(e.message).toBe('Product with same name exists.');
      }
    });

    it('should throw AppException for missing required properties', async () => {
      const invalidDto: any = { brand: 'Test' }; // Faltam propriedades obrigatórias
      await expect(productService.createProduct(invalidDto)).rejects.toThrow(
        AppException,
      ); // Verifica se lança a exceção
      try {
        await productService.createProduct(invalidDto);
      } catch (e) {
        expect(e.status).toBe(HttpStatus.BAD_REQUEST);
        expect(e.message).toBe('Missing or null required properties.');
        expect(e.validationErrorProperties).toEqual(
          expect.arrayContaining([
            'name',
            'unit',
            'stockQuantity',
            'costPrice',
            'profitMargin',
            'profit',
            'salePrice',
          ]),
        );
      }
    });
  });

  describe('getProductById', () => {
    it('should return a product if found', async () => {
      const created = await prismaTestClient.product.create({
        data: { ...baseCreateDto, createdAt: new Date() } as any,
      });
      const found = await productService.getProductById(created.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
    });

    it('should throw AppException if product is not found', async () => {
      await expect(productService.getProductById(99999)).rejects.toThrow(
        new AppException('Product not found.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const created = await prismaTestClient.product.create({
        data: { ...baseCreateDto, createdAt: new Date() } as any,
      });
      const updateDto: UpdateProductDto = {
        name: 'Updated Name',
        stockQuantity: 200,
      };
      const updated: ProductDto | null = await productService.updateProduct(
        created.id,
        updateDto,
      );

      expect(updated).not.toBeNull();
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.brand).toBe(baseCreateDto.brand);
      expect(updated?.stockQuantity).toBe(200);

      const dbProduct = await prismaTestClient.product.findUnique({
        where: { id: created.id },
      });
      expect(dbProduct?.name).toBe('Updated Name');
    });

    it('should throw AppException if product to update is not found', async () => {
      const updateDto: UpdateProductDto = { name: 'Updated Name' };
      await expect(
        productService.updateProduct(99999, {
          ...baseCreateDto,
          ...updateDto, // Sobrescreve com os campos atualizados
          name: 'NonExistent',
        }),
      ).rejects.toThrow(
        new AppException('Product not found.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully if it has no sales history', async () => {
      const created = await prismaTestClient.product.create({
        data: { ...baseCreateDto, createdAt: new Date() } as any, // Cast para any temporário
      });
      await expect(
        productService.deleteProduct(created.id),
      ).resolves.toBeUndefined();
      const dbProduct = await prismaTestClient.product.findUnique({
        where: { id: created.id },
      });
      expect(dbProduct).toBeNull();
    });

    it('should throw AppException if product has sales history', async () => {
      // Pré-requisito: OrderRepository deve estar usando Prisma e não mocks.
      // 1. Criar Cliente
      const customer = await customerRepository.create({
        name: 'Test Customer for Order',
        email: 'ordercust@test.com',
        phone: '123456789',
        city: 'Test City',
        neighborhood: 'Test Neigh',
        street: 'Test Street',
        number: '123',
        complement: '',
        reference: '',
      });

      // 2. Criar Produto
      const product = await prismaTestClient.product.create({
        data: { ...baseCreateDto, createdAt: new Date() } as any, // Cast para any temporário
      });

      // 3. Mockar o OrderService para simular que o produto tem histórico de vendas
      //    Não é necessário criar um pedido real no banco para este teste específico.
      //    Apenas precisamos que `getOrdersByProductId` retorne um array não vazio.
      const mockOrder: Partial<Order> = {
        // Usar Partial<Order> ou any para o mock
        id: 1,
        customerId: customer.id,
        status: OrderStatus.PENDING,
        // Adicione outros campos obrigatórios de Order se a tipagem for estrita,
        // ou use 'as any' ou 'as Order' se a estrutura completa não for crucial para o mock.
        // Para este caso, um objeto simples indicando a existência de um pedido é suficiente.
      };

      jest
        .spyOn(orderServiceInstance, 'getOrdersByProductId')
        .mockResolvedValueOnce([mockOrder as Order]); // Retorna um array com um pedido mockado

      await expect(productService.deleteProduct(product.id)).rejects.toThrow(
        new AppException(
          'Cannot remove product. It has a sales history.',
          HttpStatus.BAD_REQUEST,
        ),
      );

      // Opcional: Verificar se o mock foi chamado corretamente
      expect(orderServiceInstance.getOrdersByProductId).toHaveBeenCalledWith(
        product.id,
      );
    });

    it('should throw AppException if product to delete is not found', async () => {
      await expect(productService.deleteProduct(99999)).rejects.toThrow(
        new AppException('Product not found.', HttpStatus.NOT_FOUND),
      );
    });
  });
});
