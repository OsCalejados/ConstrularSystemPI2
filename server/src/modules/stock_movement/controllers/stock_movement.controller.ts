import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Query,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { IStockMovementService } from '../interfaces/stock_movement.service.interface';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { MovementType } from '@src/common/enums/movement_type.enum';
import { StockMovementDTO } from '../dtos/stock_movement.dto';
import { CreateStockMovementDTO } from '../dtos/create_stock_movement.dto';

@Controller('stockMovements')
export class StockMovementController {
  constructor(
    @Inject('IStockMovementService')
    private stockMovementService: IStockMovementService,
  ) {}
  @Get()
  @ApiOperation({ summary: 'Get all stock movements' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all stock movements.',
    type: [StockMovementDTO],
  })
  @ApiQuery({
    name: 'type',
    enum: MovementType,
    required: false,
    description: 'Filter stock movements by type (IN or OUT)',
  })
  @HttpCode(HttpStatus.OK)
  async getAllStockMovements(@Query('type') type?: MovementType) {
    return await this.stockMovementService.getAllStockMovements(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a stock movement by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the stock movement',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the stock movement with the specified ID.',
    type: StockMovementDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stock movement not found.',
  })
  @HttpCode(HttpStatus.OK)
  async getStockMovementById(@Param('id', ParseIntPipe) id: number) {
    return await this.stockMovementService.getStockMovementById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new stock movement' })
  @ApiBody({
    type: CreateStockMovementDTO,
    description: 'Data for creating a new stock movement',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The stock movement has been successfully created.',
    type: StockMovementDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @HttpCode(HttpStatus.CREATED)
  async createStockMovement(@Body() stockMovementDto: CreateStockMovementDTO) {
    return await this.stockMovementService.createStockMovement(
      stockMovementDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a stock movement' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the stock movement to delete',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The stock movement has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stock movement not found.',
  })
  @HttpCode(HttpStatus.OK)
  async deleteStockMovement(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.stockMovementService.deleteStockMovement(id);
  }
}
