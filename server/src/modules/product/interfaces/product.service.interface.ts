import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductDto } from '../dtos/product.dto';

export abstract class IProductService {
  abstract getAllProducts(): Promise<ProductDto[]>;

  abstract getProductById(productId: number): Promise<ProductDto | null>;

  abstract createProduct(data: CreateProductDto): Promise<ProductDto>;

  abstract updateProduct(
    productId: number,
    data: UpdateProductDto,
  ): Promise<ProductDto | null>;

  abstract deleteProduct(productId: number): Promise<void>;
}
