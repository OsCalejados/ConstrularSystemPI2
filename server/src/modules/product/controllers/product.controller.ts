import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { IProductService } from '../interfaces/product.service.interface';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductDto } from '../dtos/product.dto';

@Controller('products')
export class ProductController {
  constructor(
    @Inject('IProductService') private productService: IProductService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all products.',
    type: [ProductDto],
  })
  @HttpCode(HttpStatus.OK)
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the product', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the product.',
    type: ProductDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  @HttpCode(HttpStatus.OK)
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.getProductById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    type: CreateProductDto,
    description: 'Data for creating a new product',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The product has been successfully created.',
    type: ProductDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createProduct(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to update',
    type: Number,
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Data for updating the product',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully updated.',
    type: ProductDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to delete',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Product cannot be deleted (e.g., has sales history).',
  })
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.productService.deleteProduct(id);
  }
}
