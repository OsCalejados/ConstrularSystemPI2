import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '@src/modules/product/controllers/product.controller';
import { MeasureUnit } from '@src/common/enums/measure-unit.enum';
import { CreateProductDto } from '@src/modules/product/dtos/create-product.dto';
import { UpdateProductDto } from '@src/modules/product/dtos/update-product.dto';
import { AppException } from '@src/common/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StartedTestContainer, GenericContainer, Wait } from 'testcontainers'; // Keep this import
import { execSync } from 'child_process';
import { ProductFactory } from '../factories/product.factory';
import { ProductModule } from '@src/modules/product/product.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import { CustomerModule } from '@src/modules/customer/customer.module';
import { OrderModule } from '@src/modules/order/order.module';
import { StockMovementModule } from '@src/modules/stock_movement/stock_movement.module';
import { UserModule } from '@src/modules/user/user.module';
import { IOrderService } from '@src/modules/order/interfaces/order.service.interface';
import { CustomerRepository } from '@src/modules/customer/interfaces/customer.repository.interface';
import { OrderStatus } from '@src/common/enums/order-status.enum';
import { OrderType } from '@src/common/enums/order-type.enum';

describe('ProductController (Integration)', () => {
  let controller: ProductController;
  let prismaTestClient: PrismaClient;
  let container: StartedTestContainer;
  let orderService: IOrderService;
  let customerRepository: CustomerRepository; // Adicionado para criar clientes
  let testSeller: any; // Adicionado para criar pedidos

  const baseProductDto = ProductFactory.createProductDto();
  const baseCreateProductDto = ProductFactory.createProductDto({
    name: 'New Product',
    brand: 'New Brand',
    unit: MeasureUnit.KG,
    stockQuantity: 50,
    costPrice: 200,
    profitMargin: 0.25,
    profit: 50,
    salePrice: 250,
  });

  beforeAll(async () => {
    console.log(
      '[ProductController Integration] Starting PostgreSQL container...',
    );
    container = await new GenericContainer('postgres:latest') // Use a versão mais recente
      .withEnvironment({ POSTGRES_DB: 'test_db_product_service' })
      .withEnvironment({ POSTGRES_USER: 'test_user' })
      .withEnvironment({ POSTGRES_PASSWORD: 'test_password' })
      .withExposedPorts(5432) // Expondo a porta padrão do PostgreSQL
      .withWaitStrategy(
        Wait.forLogMessage('database system is ready to accept connections', 2),
      ) // Espera a mensagem de log
      .withStartupTimeout(180000) // Aumenta o tempo limite de inicialização para 3 minutos
      .start();
    console.log('[ProductService Integration] PostgreSQL container started.');

    const databaseUrl = `postgresql://test_user:test_password@${container.getHost()}:${container.getFirstMappedPort()}/test_db_product_service`;
    process.env.DATABASE_URL = databaseUrl;
    console.log(
      `[ProductService Integration] DATABASE_URL set to: ${databaseUrl}`,
    );

    console.log('[ProductService Integration] Applying Prisma migrations...');
    try {
      execSync('npx prisma migrate reset --force', {
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

    controller = module.get<ProductController>(ProductController);
    orderService = module.get<IOrderService>('IOrderService'); // Obtém a instância real do serviço
    customerRepository = module.get<CustomerRepository>(CustomerRepository); // Obtém o repositório real de clientes

    console.log('[ProductService Integration] Service instances obtained.');
  }, 300000);

  beforeEach(async () => {
    await prismaTestClient.address.deleteMany({});
    await prismaTestClient.customer.deleteMany({});
    await prismaTestClient.order.deleteMany({});
    await prismaTestClient.orderItem.deleteMany({});
    await prismaTestClient.orderPayment.deleteMany({});
    await prismaTestClient.product.deleteMany({});
    await prismaTestClient.user.deleteMany({}); // Limpa usuários também

    // Cria um vendedor de teste para a criação de pedidos
    testSeller = await prismaTestClient.user.create({
      data: {
        name: 'Test Seller',
        username: 'testseller_ctrl', // Nome de usuário único
        password: 'password123',
        role: 'SELLER',
      },
    });
  });

  afterAll(async () => {
    await prismaTestClient?.$disconnect();
    await container?.stop();
    delete process.env.DATABASE_URL;
    // A parte abaixo é redundante se prismaTestClient já foi desconectado e usado para todos os testes.
    // const prismaServiceInstance = (
    //   await Test.createTestingModule({ providers: [PrismaService] }).compile()
    // ).get(PrismaService);
    // await prismaServiceInstance?.$disconnect();
    console.log('[ProductController Integration] Teardown complete.');
  }, 120000);

  describe('getAllProducts', () => {
    describe('deve retornar um array de produtos', () => {
      it('', async () => {
        await prismaTestClient.product.createMany({
          data: [
            { ...baseProductDto, name: 'Product Alpha', createdAt: new Date() },
            { ...baseProductDto, name: 'Product Beta', createdAt: new Date() },
          ],
        });
        const result = await controller.getAllProducts();
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Product Alpha');
        expect(result[1].name).toBe('Product Beta');
      });
    });

    describe('deve retornar um array vazio se não existirem produtos', () => {
      it('', async () => {
        const result = await controller.getAllProducts();
        expect(result).toEqual([]);
      });
    });
  });

  describe('getProductById', () => {
    describe('deve retornar um único produto se encontrado', () => {
      it('', async () => {
        const createdProduct = await prismaTestClient.product.create({
          data: { ...baseProductDto, name: 'Find Me', createdAt: new Date() },
        });

        const result = await controller.getProductById(createdProduct.id);
        expect(result).toBeDefined();
        expect(result?.id).toBe(createdProduct.id);
        expect(result?.name).toBe('Find Me');
      });
    });

    describe('deve lançar AppException se o produto não for encontrado', () => {
      it('', async () => {
        await expect(controller.getProductById(99999)).rejects.toThrow(
          new AppException('Product not found.', HttpStatus.NOT_FOUND),
        );
      });
    });
  });

  describe('createProduct', () => {
    describe('deve criar e retornar um novo produto', () => {
      it('', async () => {
        const result = await controller.createProduct(baseCreateProductDto);

        expect(result).toBeDefined();
        expect(result.id).toEqual(expect.any(Number));
        expect(result.name).toBe(baseCreateProductDto.name);
        expect(result.brand).toBe(baseCreateProductDto.brand);
        expect(result.createdAt).toEqual(expect.any(Date));

        const dbProduct = await prismaTestClient.product.findUnique({
          where: { id: result.id },
        });
        expect(dbProduct).not.toBeNull();
        expect(dbProduct?.name).toBe(baseCreateProductDto.name);
      });
    });

    describe('deve lançar AppException se a criação falhar (ex: nome duplicado)', () => {
      it('', async () => {
        await controller.createProduct(baseCreateProductDto); // Create first product
        await expect(
          controller.createProduct(baseCreateProductDto),
        ).rejects.toThrow(
          new AppException(
            'Product with same name exists.',
            HttpStatus.BAD_REQUEST,
          ),
        );
      });
    });

    describe('deve lançar AppException para números negativos', () => {
      it('', async () => {
        const invalidDto: CreateProductDto = {
          ...baseCreateProductDto,
          name: 'Negative Stock Product',
          stockQuantity: -10,
        };
        await expect(controller.createProduct(invalidDto)).rejects.toThrow(
          new AppException(
            'Negative numbers are not allowed.',
            HttpStatus.BAD_REQUEST,
          ),
        );
      });
    });
  });

  describe('updateProduct', () => {
    describe('deve atualizar e retornar o produto', () => {
      it('', async () => {
        const createdProduct = await prismaTestClient.product.create({
          data: {
            ...baseProductDto,
            name: 'To Be Updated',
            createdAt: new Date(),
          },
        });

        const updateDto: UpdateProductDto = {
          name: 'Updated Product Name',
          stockQuantity: 150,
        };
        const result = await controller.updateProduct(
          createdProduct.id,
          updateDto,
        );

        expect(result).toBeDefined();
        expect(result?.id).toBe(createdProduct.id);
        expect(result?.name).toBe('Updated Product Name');
        expect(result?.stockQuantity).toBe(150);

        const dbProduct = await prismaTestClient.product.findUnique({
          where: { id: createdProduct.id },
        });
        expect(dbProduct?.name).toBe('Updated Product Name');
        expect(dbProduct?.stockQuantity.toNumber()).toBe(150);
      });
    });

    describe('deve lançar AppException se o produto a ser atualizado não for encontrado', () => {
      it('', async () => {
        const updateDto: UpdateProductDto = { name: 'Non Existent' };
        await expect(
          controller.updateProduct(99999, updateDto),
        ).rejects.toThrow(
          new AppException('Product not found.', HttpStatus.NOT_FOUND),
        );
      });
    });

    describe('deve lançar AppException ao tentar atualizar para um nome que já existe em outro produto', () => {
      it('', async () => {
        await prismaTestClient.product.create({
          data: {
            ...baseProductDto,
            name: 'Existing Name',
            createdAt: new Date(),
          },
        });
        const productToUpdate = await prismaTestClient.product.create({
          data: {
            ...baseProductDto,
            name: 'Original Name',
            createdAt: new Date(),
          },
        });

        const updateDto: UpdateProductDto = { name: 'Existing Name' };
        await expect(
          controller.updateProduct(productToUpdate.id, updateDto),
        ).rejects.toThrow(
          new AppException(
            'Product with same name exists.',
            HttpStatus.BAD_REQUEST,
          ),
        );
      });
    });
  });

  describe('deleteProduct', () => {
    describe('deve deletar um produto com sucesso se não tiver histórico de vendas', () => {
      it('should delete a product successfully if no sales history', async () => {
        const createdProduct = await prismaTestClient.product.create({
          data: {
            ...baseProductDto,
            name: 'To Be Deleted',
            createdAt: new Date(),
          },
        });

        // Não é necessário mockar orderService.getOrdersByProductId, ele retornará vazio naturalmente se não houver pedidos
        await expect(
          controller.deleteProduct(createdProduct.id),
        ).resolves.toBeUndefined();

        const dbProduct = await prismaTestClient.product.findUnique({
          where: { id: createdProduct.id },
        });
        expect(dbProduct).toBeNull();
      });
    });

    describe('deve lançar AppException se o produto a ser deletado não for encontrado', () => {
      it('should throw AppException if product to delete is not found', async () => {
        // Não é necessário mockar orderService.getOrdersByProductId aqui, pois a verificação de produto não encontrado ocorre primeiro
        await expect(controller.deleteProduct(99999)).rejects.toThrow(
          new AppException('Product not found.', HttpStatus.NOT_FOUND),
        );
      });
    });

    describe('deve lançar AppException se o produto tiver histórico de vendas', () => {
      it('should throw AppException if product has sales history', async () => {
        const createdProduct = await prismaTestClient.product.create({
          data: {
            ...baseProductDto,
            name: 'With Sales History',
            createdAt: new Date(),
          },
        });

        // Cria um cliente real
        const customer = await customerRepository.create({
          name: 'Test Customer for Sales History',
          email: 'saleshistory@test.com',
          phone: '11987654321',
          city: 'Sao Paulo',
          neighborhood: 'Centro',
          street: 'Rua Teste',
          number: '123',
          complement: '',
          reference: '',
        });

        // Cria um pedido real vinculado ao produto e ao vendedor
        await orderService.createOrder(
          {
            customerId: customer.id,
            status: OrderStatus.COMPLETED, // Usa COMPLETED para garantir que é histórico de vendas
            total: createdProduct.salePrice.toNumber(),
            subtotal: createdProduct.salePrice.toNumber(),
            type: OrderType.INSTALLMENT,
            discount: 0,
            paid: true,
            items: [
              {
                productId: createdProduct.id,
                quantity: 1,
                unitPrice: createdProduct.salePrice.toNumber(),
                total: createdProduct.salePrice.toNumber(),
              },
            ],
            notes: 'Order for sales history test',
            payments: [],
            useBalance: false,
          },
          testSeller.id,
        );

        // Agora, quando orderService.getOrdersByProductId for chamado, ele encontrará este pedido real
        await expect(
          controller.deleteProduct(createdProduct.id),
        ).rejects.toThrow(
          new AppException(
            'Cannot remove product. It has a sales history.',
            HttpStatus.BAD_REQUEST,
          ),
        );
      });
    });
  });
});
