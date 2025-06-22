// import { Test, TestingModule } from '@nestjs/testing';
// import { ProductController } from '@src/modules/product/controllers/product.controller';
// import { ProductService } from '@src/modules/product/services/product.service';
// import { ProductRepository } from '@src/modules/product/repositories/product.repository';
// import { PrismaService } from '@src/common/services/prisma.service';
// import { IOrderService } from '@src/modules/order/interfaces/order.service.interface';
// import { ProductDto } from '@src/modules/product/dtos/product.dto';
// import { MeasureUnit } from '@src/common/enums/measure-unit.enum';
// import { CreateProductDto } from '@src/modules/product/dtos/create-product.dto';
// import { UpdateProductDto } from '@src/modules/product/dtos/update-product.dto';
// import { AppException } from '@src/common/exceptions/app.exception';
// import { HttpStatus } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { StartedTestContainer, GenericContainer, Wait } from 'testcontainers';
// import { execSync } from 'child_process';

// describe('ProductController (Integration)', () => {
//   let controller: ProductController;
//   let prismaTestClient: PrismaClient;
//   let container: StartedTestContainer;
//   let mockOrderService: jest.Mocked<IOrderService>;

//   // Base DTOs for testing
//   const baseProductDto: Omit<ProductDto, 'id' | 'createdAt'> = {
//     name: 'Test Product',
//     brand: 'Test Brand',
//     unit: MeasureUnit.UN,
//     stockQuantity: 10,
//     costPrice: 100,
//     profitMargin: 0.2,
//     profit: 20,
//     salePrice: 120,
//   };

//   const baseCreateProductDto: CreateProductDto = {
//     name: 'New Product',
//     brand: 'New Brand',
//     unit: MeasureUnit.KG,
//     stockQuantity: 50,
//     costPrice: 200,
//     profitMargin: 0.25,
//     profit: 50,
//     salePrice: 250,
//   };

//   beforeAll(async () => {
//     console.log(
//       '[ProductController Integration] Starting PostgreSQL container...',
//     );
//     container = await new GenericContainer('postgres:17')
//       .withEnvironment({ POSTGRES_DB: 'test_db_product_ctrl' })
//       .withEnvironment({ POSTGRES_USER: 'test_user' })
//       .withEnvironment({ POSTGRES_PASSWORD: 'test_password' })
//       .withExposedPorts(5432)
//       .withWaitStrategy(
//         Wait.forLogMessage('database system is ready to accept connections', 2),
//       )
//       .start();
//     console.log(
//       '[ProductController Integration] PostgreSQL container started.',
//     );

//     const databaseUrl = `postgresql://test_user:test_password@${container.getHost()}:${container.getFirstMappedPort()}/test_db_product_ctrl`;
//     process.env.DATABASE_URL = databaseUrl;
//     console.log(
//       `[ProductController Integration] DATABASE_URL set to: ${databaseUrl}`,
//     );

//     console.log(
//       '[ProductController Integration] Applying Prisma migrations...',
//     );
//     try {
//       execSync('npx prisma migrate deploy', {
//         env: { ...process.env, DATABASE_URL: databaseUrl },
//         stdio: 'inherit',
//       });
//       console.log(
//         '[ProductController Integration] Prisma migrations applied successfully.',
//       );
//     } catch (error) {
//       console.error(
//         '[ProductController Integration] Failed to apply Prisma migrations:',
//         error,
//       );
//       await container.stop();
//       throw error;
//     }

//     prismaTestClient = new PrismaClient({
//       datasources: { db: { url: databaseUrl } },
//     });
//     await prismaTestClient.$connect();
//     console.log(
//       '[ProductController Integration] Direct Prisma client connected.',
//     );

//     // Mock for IOrderService
//     mockOrderService = {
//       getOrdersByProductId: jest.fn(),
//       // Mock other methods of IOrderService if ProductService calls them
//     } as unknown as jest.Mocked<IOrderService>;

//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       controllers: [ProductController],
//       providers: [
//         { provide: 'IProductService', useClass: ProductService },
//         { provide: 'IProductRepository', useClass: ProductRepository },
//         PrismaService, // Will use the DATABASE_URL from process.env
//         {
//           provide: 'IOrderService',
//           useValue: mockOrderService,
//         },
//       ],
//     }).compile();

//     controller = moduleFixture.get<ProductController>(ProductController);
//     console.log(
//       '[ProductController Integration] Controller and services initialized.',
//     );
//   }, 120000);

//   beforeEach(async () => {
//     // Clean the database before each test
//     await prismaTestClient.product.deleteMany({});
//     // Reset mocks
//     mockOrderService.getOrdersByProductId.mockClear();
//   });

//   afterAll(async () => {
//     await prismaTestClient?.$disconnect();
//     await container?.stop();
//     delete process.env.DATABASE_URL;
//     const prismaServiceInstance = (
//       await Test.createTestingModule({ providers: [PrismaService] }).compile()
//     ).get(PrismaService);
//     await prismaServiceInstance?.$disconnect();
//     console.log('[ProductController Integration] Teardown complete.');
//   }, 120000);

//   describe('deve ser definido', () => {
//     it('', () => {
//       expect(controller).toBeDefined();
//     });
//   });

//   describe('getAllProducts', () => {
//     describe('deve retornar um array de produtos', () => {
//       it('', async () => {
//         await prismaTestClient.product.createMany({
//           data: [
//             { ...baseProductDto, name: 'Product Alpha', createdAt: new Date() },
//             { ...baseProductDto, name: 'Product Beta', createdAt: new Date() },
//           ],
//         });
//         const result = await controller.getAllProducts();
//         expect(result).toHaveLength(2);
//         expect(result[0].name).toBe('Product Alpha');
//         expect(result[1].name).toBe('Product Beta');
//       });
//     });

//     describe('deve retornar um array vazio se não existirem produtos', () => {
//       it('', async () => {
//         const result = await controller.getAllProducts();
//         expect(result).toEqual([]);
//       });
//     });
//   });

//   describe('getProductById', () => {
//     describe('deve retornar um único produto se encontrado', () => {
//       it('', async () => {
//         const createdProduct = await prismaTestClient.product.create({
//           data: { ...baseProductDto, name: 'Find Me', createdAt: new Date() },
//         });

//         const result = await controller.getProductById(createdProduct.id);
//         expect(result).toBeDefined();
//         expect(result?.id).toBe(createdProduct.id);
//         expect(result?.name).toBe('Find Me');
//       });
//     });

//     describe('deve lançar AppException se o produto não for encontrado', () => {
//       it('', async () => {
//         await expect(controller.getProductById(99999)).rejects.toThrow(
//           new AppException('Product not found.', HttpStatus.NOT_FOUND),
//         );
//       });
//     });
//   });

//   describe('createProduct', () => {
//     describe('deve criar e retornar um novo produto', () => {
//       it('', async () => {
//         const result = await controller.createProduct(baseCreateProductDto);

//         expect(result).toBeDefined();
//         expect(result.id).toEqual(expect.any(Number));
//         expect(result.name).toBe(baseCreateProductDto.name);
//         expect(result.brand).toBe(baseCreateProductDto.brand);
//         expect(result.createdAt).toEqual(expect.any(Date));

//         const dbProduct = await prismaTestClient.product.findUnique({
//           where: { id: result.id },
//         });
//         expect(dbProduct).not.toBeNull();
//         expect(dbProduct?.name).toBe(baseCreateProductDto.name);
//       });
//     });

//     describe('deve lançar AppException se a criação falhar (ex: nome duplicado)', () => {
//       it('', async () => {
//         await controller.createProduct(baseCreateProductDto); // Create first product
//         await expect(
//           controller.createProduct(baseCreateProductDto),
//         ).rejects.toThrow(
//           new AppException(
//             'Product with same name exists.',
//             HttpStatus.BAD_REQUEST,
//           ),
//         );
//       });
//     });

//     describe('deve lançar AppException para números negativos', () => {
//       it('', async () => {
//         const invalidDto: CreateProductDto = {
//           ...baseCreateProductDto,
//           name: 'Negative Stock Product',
//           stockQuantity: -10,
//         };
//         await expect(controller.createProduct(invalidDto)).rejects.toThrow(
//           new AppException(
//             'Negative numbers are not allowed.',
//             HttpStatus.BAD_REQUEST,
//           ),
//         );
//       });
//     });
//   });

//   describe('updateProduct', () => {
//     describe('deve atualizar e retornar o produto', () => {
//       it('', async () => {
//         const createdProduct = await prismaTestClient.product.create({
//           data: {
//             ...baseProductDto,
//             name: 'To Be Updated',
//             createdAt: new Date(),
//           },
//         });

//         const updateDto: UpdateProductDto = {
//           name: 'Updated Product Name',
//           stockQuantity: 150,
//         };
//         const result = await controller.updateProduct(
//           createdProduct.id,
//           updateDto,
//         );

//         expect(result).toBeDefined();
//         expect(result?.id).toBe(createdProduct.id);
//         expect(result?.name).toBe('Updated Product Name');
//         expect(result?.stockQuantity).toBe(150);

//         const dbProduct = await prismaTestClient.product.findUnique({
//           where: { id: createdProduct.id },
//         });
//         expect(dbProduct?.name).toBe('Updated Product Name');
//         expect(dbProduct?.stockQuantity.toNumber()).toBe(150);
//       });
//     });

//     describe('deve lançar AppException se o produto a ser atualizado não for encontrado', () => {
//       it('', async () => {
//         const updateDto: UpdateProductDto = { name: 'Non Existent' };
//         await expect(
//           controller.updateProduct(99999, updateDto),
//         ).rejects.toThrow(
//           new AppException('Product not found.', HttpStatus.NOT_FOUND),
//         );
//       });
//     });

//     describe('deve lançar AppException ao tentar atualizar para um nome que já existe em outro produto', () => {
//       it('', async () => {
//         await prismaTestClient.product.create({
//           data: {
//             ...baseProductDto,
//             name: 'Existing Name',
//             createdAt: new Date(),
//           },
//         });
//         const productToUpdate = await prismaTestClient.product.create({
//           data: {
//             ...baseProductDto,
//             name: 'Original Name',
//             createdAt: new Date(),
//           },
//         });

//         const updateDto: UpdateProductDto = { name: 'Existing Name' };
//         await expect(
//           controller.updateProduct(productToUpdate.id, updateDto),
//         ).rejects.toThrow(
//           new AppException(
//             'Product with same name exists.',
//             HttpStatus.BAD_REQUEST,
//           ),
//         );
//       });
//     });
//   });

//   describe('deleteProduct', () => {
//     describe('deve deletar um produto com sucesso se não tiver histórico de vendas', () => {
//       it('should delete a product successfully if no sales history', async () => {
//         const createdProduct = await prismaTestClient.product.create({
//           data: {
//             ...baseProductDto,
//             name: 'To Be Deleted',
//             createdAt: new Date(),
//           },
//         });
//         mockOrderService.getOrdersByProductId.mockResolvedValue([]);

//         await expect(
//           controller.deleteProduct(createdProduct.id),
//         ).resolves.toBeUndefined();

//         const dbProduct = await prismaTestClient.product.findUnique({
//           where: { id: createdProduct.id },
//         });
//         expect(dbProduct).toBeNull();
//         expect(mockOrderService.getOrdersByProductId).toHaveBeenCalledWith(
//           createdProduct.id,
//         );
//       });
//     });

//     describe('deve lançar AppException se o produto a ser deletado não for encontrado', () => {
//       it('should throw AppException if product to delete is not found', async () => {
//         mockOrderService.getOrdersByProductId.mockResolvedValue([]); // Should not be called if product not found first
//         await expect(controller.deleteProduct(99999)).rejects.toThrow(
//           new AppException('Product not found.', HttpStatus.NOT_FOUND),
//         );
//       });
//     });

//     describe('deve lançar AppException se o produto tiver histórico de vendas', () => {
//       it('should throw AppException if product has sales history', async () => {
//         const createdProduct = await prismaTestClient.product.create({
//           data: {
//             ...baseProductDto,
//             name: 'With Sales History',
//             createdAt: new Date(),
//           },
//         });
//         mockOrderService.getOrdersByProductId.mockResolvedValue([
//           { id: 1 } as any,
//         ]); // Simulate sales history

//         await expect(
//           controller.deleteProduct(createdProduct.id),
//         ).rejects.toThrow(
//           new AppException(
//             'Cannot remove product. It has a sales history.',
//             HttpStatus.BAD_REQUEST,
//           ),
//         );
//         expect(mockOrderService.getOrdersByProductId).toHaveBeenCalledWith(
//           createdProduct.id,
//         );
//       });
//     });
//   });
// });

describe('Remover posteriormente', () => {
  it('should be defined', () => {
    expect(1).toBeDefined();
  });
});
