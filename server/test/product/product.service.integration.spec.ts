// /* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { StartedTestContainer, GenericContainer, Wait } from 'testcontainers';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { HttpStatus } from '@nestjs/common';

// Implementações Reais
import { IOrderService } from '@src/modules/order/interfaces/order.service.interface'; // Keep this import
import { CustomerRepository } from '@src/modules/customer/interfaces/customer.repository.interface';

// DTOs
import { UpdateProductDto } from '@src/modules/product/dtos/update-product.dto';
import { AppException } from '@src/common/exceptions/app.exception';
import { OrderStatus } from '@src/common/enums/order-status.enum';
import { MeasureUnit } from '@src/common/enums/measure-unit.enum';
import { ProductDto } from '@src/modules/product/dtos/product.dto';
import { ProductFactory } from '@test/factories/product.factory';
import { OrderType } from '@src/common/enums/order-type.enum';
import { OrderDto } from '@src/modules/order/dtos/order.dto';
import { IOrderRepository } from '@src/modules/order/interfaces/order.repository.interface';
import { AuthModule } from '@src/modules/auth/auth.module';
import { CustomerModule } from '@src/modules/customer/customer.module';
import { OrderModule } from '@src/modules/order/order.module';
import { ProductModule } from '@src/modules/product/product.module';
import { StockMovementModule } from '@src/modules/stock_movement/stock_movement.module';
import { UserModule } from '@src/modules/user/user.module';
import { IProductService } from '@src/modules/product/interfaces/product.service.interface';

describe('ProductService (Integration)', () => {
  let productService: IProductService;
  let orderRepository: IOrderRepository;
  let customerRepository: CustomerRepository;
  let prismaTestClient: PrismaClient;
  let container: StartedTestContainer;
  let orderServiceInstance: IOrderService;
  let testSeller: any; // Adicionar uma variável para o vendedor de teste

  const baseCreateDto = ProductFactory.createProductDto({
    name: 'Testable Product',
    brand: 'Test Brand',
    unit: MeasureUnit.UN,
    stockQuantity: 100,
    costPrice: 50,
    profitMargin: 0.2,
    profit: 10,
    salePrice: 60,
  });

  beforeAll(async () => {
    console.log(
      '[ProductService Integration] Starting PostgreSQL container...',
    );
    container = await new GenericContainer('postgres:latest') // Use a versão mais recente
      .withEnvironment({ POSTGRES_DB: 'test_db_product_service' })
      .withEnvironment({ POSTGRES_USER: 'test_user' })
      .withEnvironment({ POSTGRES_PASSWORD: 'test_password' })
      .withExposedPorts(5432) // Expondo a porta padrão do PostgreSQL
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
      execSync('npx prisma migrate deploy && npx prisma db push', {
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
      imports: [
        // Importa todos os módulos dos quais ProductController depende
        AuthModule,
        CustomerModule,
        UserModule,
        ProductModule,
        OrderModule,
        StockMovementModule,
      ],
    }).compile();
    console.log('[ProductService Integration] NestJS testing module compiled.');

    productService = module.get<IProductService>('IProductService');
    orderServiceInstance = module.get<IOrderService>('IOrderService');
    orderRepository = module.get<IOrderRepository>('IOrderRepository');
    customerRepository = module.get<CustomerRepository>(CustomerRepository);

    console.log('[ProductService Integration] Service instances obtained.');
  }, 300000);

  beforeEach(async () => {
    await prismaTestClient.address.deleteMany({});
    await prismaTestClient.customer.deleteMany({});
    await prismaTestClient.order.deleteMany({});
    await prismaTestClient.orderItem.deleteMany({});
    await prismaTestClient.orderPayment.deleteMany({});
    await prismaTestClient.product.deleteMany({});
    // Limpar usuários antes de criar o vendedor de teste para garantir um estado limpo
    await prismaTestClient.user.deleteMany({});

    // Criar um usuário (vendedor) para os testes em cada beforeEach
    testSeller = await prismaTestClient.user.create({
      data: {
        name: 'Test Seller',
        username: 'testseller',
        password: 'password123',
        role: 'SELLER',
      },
    });
  });

  afterAll(async () => {
    await prismaTestClient?.$disconnect();
    await container?.stop();
    delete process.env.DATABASE_URL;
  }, 300000);
  describe('getAllProducts', () => {
    describe('deve retornar todos os produtos criados', () => {
      it('should return all created products', async () => {
        await prismaTestClient.product.createMany({
          data: [
            {
              ...baseCreateDto,
              name: 'Product A',
              createdAt: new Date(),
            } as any,
            {
              ...baseCreateDto,
              name: 'Product B',
              brand: 'Other Brand',
              createdAt: new Date(),
            } as any,
          ],
        });

        const products = await productService.getAllProducts();
        expect(products).toHaveLength(2);
        expect(products.map((p) => p.name).sort()).toEqual(
          ['Product A', 'Product B'].sort(),
        );
      });
    });

    describe('deve retornar um array vazio se não existirem produtos', () => {
      it('should return an empty array if no products exist', async () => {
        const products = await productService.getAllProducts();
        expect(products).toHaveLength(0);
      });
    });

    describe('deve lançar AppException com INTERNAL_SERVER_ERROR se o repositório findAll falhar inesperadamente', () => {
      it('should throw AppException with INTERNAL_SERVER_ERROR if repository findAll fails unexpectedly', async () => {
        jest
          .spyOn(productService['productRepository'], 'findAll')
          .mockRejectedValueOnce(new Error('DB connection error'));
        await expect(productService.getAllProducts()).rejects.toThrow(
          new AppException(
            'Failed to retrieve products from database.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });
  });

  describe('createProduct', () => {
    describe('deve criar um novo produto com sucesso', () => {
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
    });

    describe('deve lançar AppException se um produto com o mesmo nome já existir', () => {
      it('should throw AppException if product with the same name already exists', async () => {
        await productService.createProduct({
          ...baseCreateDto,
        });
        await expect(
          productService.createProduct({
            ...baseCreateDto,
            createdAt: new Date(),
          } as any),
        ).rejects.toThrow(AppException);
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
    });

    describe('deve lançar AppException por propriedades obrigatórias ausentes', () => {
      it('should throw AppException for missing required properties', async () => {
        const invalidDto: any = { brand: 'Test' };
        await expect(productService.createProduct(invalidDto)).rejects.toThrow(
          AppException,
        );
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

    describe('deve lançar AppException com INTERNAL_SERVER_ERROR se o repositório create falhar inesperadamente', () => {
      it('should throw AppException with INTERNAL_SERVER_ERROR if repository create fails unexpectedly', async () => {
        jest
          .spyOn(productService['productRepository'], 'existsByName')
          .mockRejectedValueOnce(new Error('DB connection error'));
        await expect(
          productService.createProduct(baseCreateDto),
        ).rejects.toThrow(
          new AppException(
            'Failed to create product.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });
  });

  describe('getProductById', () => {
    describe('deve retornar um produto se encontrado', () => {
      it('should return a product if found', async () => {
        const created = await prismaTestClient.product.create({
          data: { ...baseCreateDto, createdAt: new Date() } as any,
        });
        const found = await productService.getProductById(created.id);
        expect(found).not.toBeNull();
        expect(found?.id).toBe(created.id);
      });
    });

    describe('deve lançar AppException se o produto não for encontrado', () => {
      it('should throw AppException if product is not found', async () => {
        await expect(productService.getProductById(99999)).rejects.toThrow(
          new AppException('Product not found.', HttpStatus.NOT_FOUND),
        );
      });
    });

    describe('deve lançar AppException com INTERNAL_SERVER_ERROR se o repositório findById falhar inesperadamente', () => {
      it('should throw AppException with INTERNAL_SERVER_ERROR if repository findById fails unexpectedly', async () => {
        jest
          .spyOn(productService['productRepository'], 'findById')
          .mockRejectedValueOnce(new Error('DB connection error'));
        await expect(productService.getProductById(1)).rejects.toThrow(
          new AppException(
            'Failed to retrieve product with ID 1.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });
  });

  describe('updateProduct', () => {
    describe('deve atualizar um produto existente', () => {
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
    });

    describe('deve lançar AppException se o produto a ser atualizado não for encontrado', () => {
      it('should throw AppException if product to update is not found', async () => {
        const updateDto: UpdateProductDto = { name: 'Updated Name' };
        await expect(
          productService.updateProduct(99999, {
            ...baseCreateDto,
            ...updateDto,
            name: 'NonExistent',
          }),
        ).rejects.toThrow(
          new AppException('Product not found.', HttpStatus.NOT_FOUND),
        );
      });
    });

    describe('deve lançar AppException com INTERNAL_SERVER_ERROR se o repositório update falhar inesperadamente', () => {
      it('should throw AppException with INTERNAL_SERVER_ERROR if repository update fails unexpectedly', async () => {
        const created = await prismaTestClient.product.create({
          data: { ...baseCreateDto, createdAt: new Date() } as any,
        });
        const updateDto: UpdateProductDto = { name: 'Updated Name' };
        jest
          .spyOn(productService['productRepository'], 'update')
          .mockRejectedValueOnce(new Error('DB connection error'));
        await expect(
          productService.updateProduct(created.id, updateDto),
        ).rejects.toThrow(
          new AppException(
            `Failed to update product with ID ${created.id}.`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });
  });

  describe('deleteProduct', () => {
    describe('deve deletar um produto com sucesso se não tiver histórico de vendas', () => {
      it('should delete a product successfully if it has no sales history', async () => {
        const created = await prismaTestClient.product.create({
          data: { ...baseCreateDto, createdAt: new Date() } as any,
        });
        jest
          .spyOn(orderServiceInstance, 'getOrdersByProductId')
          .mockResolvedValue([]);
        await expect(
          productService.deleteProduct(created.id),
        ).resolves.toBeUndefined();
        const dbProduct = await prismaTestClient.product.findUnique({
          where: { id: created.id },
        });
        expect(dbProduct).toBeNull();
      });
    });

    describe('deve lançar AppException se o produto tiver histórico de vendas', () => {
      it('should throw AppException if product has sales history', async () => {
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

        const product = await prismaTestClient.product.create({
          data: { ...baseCreateDto, createdAt: new Date() } as any,
        });

        const mockOrder = await orderRepository.create(
          {
            customerId: customer.id,
            status: OrderStatus.OPEN, // Corrigido para usar OrderStatus.OPEN
            total: 10,
            subtotal: 10,
            type: OrderType.SALE,
            discount: 0,
            paid: false,
            items: [
              {
                productId: product.id,
                quantity: 1,
                unitPrice: 0,
                total: 0,
              },
            ],
            notes: '',
            payments: [],
            useBalance: false,
          },
          testSeller.id, // Passar o ID do vendedor de teste,
          prismaTestClient,
        );

        jest
          .spyOn(orderServiceInstance, 'getOrdersByProductId')
          .mockResolvedValue([mockOrder as OrderDto]);

        await expect(productService.deleteProduct(product.id)).rejects.toThrow(
          new AppException(
            'Cannot remove product. It has a sales history.',
            HttpStatus.BAD_REQUEST,
          ),
        );

        expect(orderServiceInstance.getOrdersByProductId).toHaveBeenCalledWith(
          product.id,
        );
      });
    });

    describe('deve lançar AppException se o produto a ser deletado não for encontrado', () => {
      it('should throw AppException if product to delete is not found', async () => {
        await expect(productService.deleteProduct(99999)).rejects.toThrow(
          new AppException('Product not found.', HttpStatus.NOT_FOUND),
        );
      });
    });

    describe('deve lançar AppException com INTERNAL_SERVER_ERROR se o repositório delete falhar inesperadamente', () => {
      it('should throw AppException with INTERNAL_SERVER_ERROR if repository delete fails unexpectedly', async () => {
        const product = await prismaTestClient.product.create({
          data: { ...baseCreateDto, createdAt: new Date() } as any,
        });
        jest
          .spyOn(productService['productRepository'], 'delete')
          .mockRejectedValueOnce(new Error('DB connection error'));
        jest
          .spyOn(orderServiceInstance, 'getOrdersByProductId')
          .mockResolvedValue([]);

        await expect(productService.deleteProduct(product.id)).rejects.toThrow(
          new AppException(
            `Failed to delete product with ID ${product.id}.`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });
  });
});
