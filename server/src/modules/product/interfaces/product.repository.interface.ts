import { Prisma, Product } from '@prisma/client';

export interface IProductRepository {
  findAll(): Promise<Product[]>; // Retorna todos os produtos
  findById(productId: number): Promise<Product | null>; // Busca um produto pelo ID
  create(data: Prisma.ProductCreateInput): Promise<Product>; // Cria um novo produto
  update(
    productId: number,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product | null>; // Atualiza um produto existente
  delete(productId: number): Promise<void>; // Remove um produto pelo ID
  existsByName(productName: string): Promise<boolean>;
  getAllByName(productName: string): Promise<Product[]>;
}
