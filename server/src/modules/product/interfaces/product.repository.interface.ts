import { Prisma, Product } from '@prisma/client';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(productId: number): Promise<Product | null>;
  create(data: Prisma.ProductCreateInput): Promise<Product>;
  update(
    productId: number,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product | null>;
  delete(productId: number): Promise<void>;
  existsByName(productName: string): Promise<boolean>;
  getAllByName(productName: string): Promise<Product[]>;
}
