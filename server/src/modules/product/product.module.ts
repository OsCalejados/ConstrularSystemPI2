import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';
import { PrismaService } from 'src/common/services/prisma.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, PrismaService],
})
export class ProductModule {}
