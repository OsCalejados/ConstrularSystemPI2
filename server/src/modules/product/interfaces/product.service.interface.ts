import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductDto } from '../dtos/product.dto';

export interface IProductService {
  getAllProducts(): Promise<ProductDto[]>; // Retorna todos os produtos
  getProductById(productId: number): Promise<ProductDto | null>; // Busca um produto pelo ID
  createProduct(data: CreateProductDto): Promise<ProductDto>; // Cria um novo produto
  updateProduct(
    productId: number,
    data: UpdateProductDto,
  ): Promise<ProductDto | null>; // Atualiza um produto existente
  deleteProduct(productId: number): Promise<void>; // Remove um produto pelo ID
}
