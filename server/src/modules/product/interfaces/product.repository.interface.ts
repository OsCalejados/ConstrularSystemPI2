import { Prisma, Product } from '@prisma/client';

export abstract class IProductRepository {
  abstract findAll(): Promise<Product[]>;

  abstract findById(productId: number): Promise<Product | null>;

  abstract create(data: Prisma.ProductCreateInput): Promise<Product>;

  abstract update(
    productId: number,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product | null>;

  abstract delete(productId: number): Promise<void>;

  abstract existsByName(productName: string): Promise<boolean>;

  abstract getAllByName(productName: string): Promise<Product[]>;
}
