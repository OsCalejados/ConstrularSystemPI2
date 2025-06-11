import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductDto } from '../dtos/product.dto';

export interface IProductService {
  getAllProducts(): Promise<ProductDto[]>;
  getProductById(productId: number): Promise<ProductDto | null>;
  createProduct(data: CreateProductDto): Promise<ProductDto>;
  updateProduct(
    productId: number,
    data: UpdateProductDto,
  ): Promise<ProductDto | null>;
  deleteProduct(productId: number): Promise<void>;
}
