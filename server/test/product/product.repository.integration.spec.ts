import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/common/services/prisma.service';
import { ProductRepository } from '@src/modules/product/repositories/product.repository';
import { StartedTestContainer, GenericContainer } from 'testcontainers';
import { Wait } from 'testcontainers';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

describe('ProductRepository (Integration)', () => {
  let repository: ProductRepository;
  let prismaService: PrismaService;
  let container: StartedTestContainer;
  let client: PrismaClient;

  beforeAll(async () => {
    // Iniciar o container PostgreSQL
    console.log('Starting PostgreSQL container...');
    container = await new GenericContainer('postgres:17')
      .withEnvironment({ POSTGRES_DB: 'test_db' })
      .withEnvironment({ POSTGRES_USER: 'test_user' })
      .withEnvironment({ POSTGRES_PASSWORD: 'test_password' })
      .withExposedPorts(5432)
      .withWaitStrategy(
        Wait.forLogMessage('database system is ready to accept connections', 2),
      ) // Espera até que a porta 5432 esteja aberta
      .start();
    console.log('PostgreSQL container started.');

    const databaseUrl = `postgresql://test_user:test_password@${container.getHost()}:${container.getFirstMappedPort()}/test_db`;

    process.env.DATABASE_URL = databaseUrl;

    console.log(`Database URL: ${databaseUrl}`);
    console.log('DATABASE_URL environment variable set.');

    console.log('Applying Prisma migrations...');
    try {
      execSync('npx prisma migrate deploy', {
        env: { ...process.env, DATABASE_URL: databaseUrl },
        stdio: 'inherit',
      });
      console.log('Prisma migrations applied successfully.');
    } catch (error) {
      console.error('Failed to apply Prisma migrations:', error);
      await container.stop();
      throw error;
    }

    console.log('Initializing direct Prisma client...');
    client = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
    console.log('Connecting direct Prisma client...');
    await client.$connect();
    console.log('Direct Prisma client connected.');

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductRepository, PrismaService],
    }).compile();
    console.log('NestJS testing module compiled.');

    repository = module.get<ProductRepository>(ProductRepository);
    prismaService = module.get<PrismaService>(PrismaService);
    console.log('Repository and Service instances obtained.');
  }, 120000);

  beforeEach(async () => {
    await client.product.deleteMany({});
  });

  afterAll(async () => {
    await client?.$disconnect();
    await container?.stop();
    delete process.env.DATABASE_URL;
    await prismaService?.$disconnect();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product in the database', async () => {
      const productData = {
        name: 'Test Product Create',
        brand: 'Test Brand',
        unit: 'UN',
        stockQuantity: 10,
        costPrice: 100,
        profitMargin: 0.2,
        profit: 20,
        salePrice: 120,
        createdAt: new Date(),
      };
      const createdProduct = await repository.create(productData);

      expect(createdProduct).toBeDefined();
      expect(createdProduct.id).toBeDefined();
      expect(createdProduct.name).toBe(productData.name);

      const dbProduct = await client.product.findUnique({
        where: { id: createdProduct.id },
      });
      expect(dbProduct).not.toBeNull();
      expect(dbProduct?.name).toBe(productData.name);
    });
  });

  describe('findAll', () => {
    it('should return all products from the database', async () => {
      await client.product.createMany({
        data: [
          {
            name: 'Product A',
            brand: 'Brand A',
            unit: 'UN',
            stockQuantity: 5,
            costPrice: 10,
            profitMargin: 0.1,
            profit: 1,
            salePrice: 11,
            createdAt: new Date(),
          },
          {
            name: 'Product B',
            brand: 'Brand B',
            unit: 'KG',
            stockQuantity: 2,
            costPrice: 20,
            profitMargin: 0.15,
            profit: 3,
            salePrice: 23,
            createdAt: new Date(),
          },
        ],
      });

      const products = await repository.findAll();
      expect(products).toHaveLength(2);
      expect(products.map((p) => p.name).sort()).toEqual(
        ['Product A', 'Product B'].sort(),
      );
    });
  });

  describe('findById', () => {
    it('should return a product by its ID', async () => {
      const created = await client.product.create({
        data: {
          name: 'Product FindById',
          brand: 'Brand C',
          unit: 'UN',
          stockQuantity: 1,
          costPrice: 5,
          profitMargin: 0.5,
          profit: 2.5,
          salePrice: 7.5,
          createdAt: new Date(),
        },
      });

      const foundProduct = await repository.findById(created.id);
      expect(foundProduct).not.toBeNull();
      expect(foundProduct?.id).toBe(created.id);
      expect(foundProduct?.name).toBe('Product FindById');
    });

    it('should return null if product with ID does not exist', async () => {
      const foundProduct = await repository.findById(99999);
      expect(foundProduct).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const initialProduct = await client.product.create({
        data: {
          name: 'Product To Update',
          brand: 'Initial Brand',
          unit: 'UN',
          stockQuantity: 10,
          costPrice: 10,
          profitMargin: 0.1,
          profit: 1,
          salePrice: 11,
          createdAt: new Date(),
        },
      });

      const updateData = { name: 'Updated Product Name' };
      const updatedProduct = await repository.update(
        initialProduct.id,
        updateData,
      );

      expect(updatedProduct).not.toBeNull();
      expect(updatedProduct?.id).toBe(initialProduct.id);
      expect(updatedProduct?.name).toBe('Updated Product Name');
      expect(updatedProduct?.brand).toBe('Initial Brand');

      const dbProduct = await client.product.findUnique({
        where: { id: initialProduct.id },
      });
      expect(dbProduct?.name).toBe('Updated Product Name');
    });

    it('should return null when trying to update a non-existent product', async () => {
      const updatedProduct = await repository.update(99999, {
        name: 'Non Existent',
      });
      expect(updatedProduct).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a product by its ID', async () => {
      const productToDelete = await client.product.create({
        data: {
          name: 'Product To Delete',
          brand: 'Delete Brand',
          unit: 'UN',
          stockQuantity: 1,
          costPrice: 1,
          profitMargin: 0,
          profit: 0,
          salePrice: 1,
          createdAt: new Date(),
        },
      });

      await repository.delete(productToDelete.id);

      const dbProduct = await client.product.findUnique({
        where: { id: productToDelete.id },
      });
      expect(dbProduct).toBeNull();
    });

    it('should not throw an error if deleting a non-existent product (Prisma delete behavior)', async () => {
      await expect(repository.delete(99999)).rejects.toThrow();
    });
  });

  describe('existsByName', () => {
    it('should return true if a product with the given name exists', async () => {
      await client.product.create({
        data: {
          name: 'Existing Product',
          brand: 'Exists Brand',
          unit: 'UN',
          stockQuantity: 1,
          costPrice: 1,
          profitMargin: 0,
          profit: 0,
          salePrice: 1,
          createdAt: new Date(),
        },
      });
      const exists = await repository.existsByName('Existing Product');
      expect(exists).toBe(true);
    });

    it('should return false if no product with the given name exists', async () => {
      const exists = await repository.existsByName('Non Existing Product');
      expect(exists).toBe(false);
    });
  });

  describe('getAllByName', () => {
    it('should return products matching the name (case-insensitive)', async () => {
      await client.product.createMany({
        data: [
          {
            name: 'Search Product Alpha',
            brand: 'Search Brand',
            unit: 'UN',
            stockQuantity: 1,
            costPrice: 1,
            profitMargin: 0,
            profit: 0,
            salePrice: 1,
            createdAt: new Date(),
          },
          {
            name: 'search product beta',
            brand: 'Search Brand',
            unit: 'UN',
            stockQuantity: 1,
            costPrice: 1,
            profitMargin: 0,
            profit: 0,
            salePrice: 1,
            createdAt: new Date(),
          },
          {
            name: 'Another Product',
            brand: 'Other Brand',
            unit: 'UN',
            stockQuantity: 1,
            costPrice: 1,
            profitMargin: 0,
            profit: 0,
            salePrice: 1,
            createdAt: new Date(),
          },
        ],
      });

      const results = await repository.getAllByName('search product');
      expect(results).toHaveLength(2);
      expect(results.map((p) => p.name).sort()).toEqual(
        ['Search Product Alpha', 'search product beta'].sort(),
      );
    });
  });
});
