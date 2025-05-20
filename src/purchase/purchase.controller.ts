import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@ApiTags('purchase')
@Controller('purchase')
export class PurchaseController {
  private readonly logger = new Logger(PurchaseController.name);
  constructor(private readonly purchasesService: PurchaseService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva compra' })
  @ApiResponse({ status: 201, description: 'Compra creada correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno al crear la compra.' })
  @ApiBody({ type: CreatePurchaseDto })
  async create(@Body() dto: CreatePurchaseDto) {
    this.logger.log(`POST /purchase - Creando compra para usuario: ${dto.userId}`);
    try {
      const purchase = await this.purchasesService.create(dto);
      return { message: 'Compra creada correctamente', purchase };
    } catch (error) {
      this.logger.error(`Error al crear compra: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error interno al crear compra', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Obtener compras por usuario' })
  @ApiResponse({ status: 200, description: 'Compras obtenidas correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno al obtener compras.' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  async findByUser(@Param('userId') userId: string) {
    this.logger.log(`GET /purchase/${userId} - Buscando compras del usuario`);
    try {
      return await this.purchasesService.findByUser(userId);
    } catch (error) {
      this.logger.error(`Error al buscar compras: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error interno al buscar compras', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('one/:id')
  @ApiOperation({ summary: 'Obtener una compra por ID' })
  @ApiResponse({ status: 200, description: 'Compra obtenida correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno al obtener la compra.' })
  @ApiParam({ name: 'id', description: 'ID de la compra' })
  async findOne(@Param('id') id: string) {
    this.logger.log(`GET /purchase/one/${id} - Buscando compra`);
    try {
      return await this.purchasesService.findOne(id);
    } catch (error) {
      this.logger.error(`Error al buscar compra: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error interno al buscar compra', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una compra por ID' })
  @ApiResponse({ status: 200, description: 'Compra actualizada correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno al actualizar la compra.' })
  @ApiParam({ name: 'id', description: 'ID de la compra' })
  @ApiBody({ type: UpdatePurchaseDto })
  async update(@Param('id') id: string, @Body() dto: Partial<CreatePurchaseDto>) {
    this.logger.log(`PATCH /purchase/${id} - Actualizando compra`);
    try {
      const purchase = await this.purchasesService.update(id, dto);
      return { message: 'Compra actualizada correctamente', purchase };
    } catch (error) {
      this.logger.error(`Error al actualizar compra: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error interno al actualizar compra', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una compra por ID' })
  @ApiResponse({ status: 200, description: 'Compra eliminada correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno al eliminar la compra.' })
  @ApiParam({ name: 'id', description: 'ID de la compra' })
  async remove(@Param('id') id: string) {
    this.logger.log(`DELETE /purchase/${id} - Eliminando compra`);
    try {
      await this.purchasesService.remove(id);
      return { message: 'Compra eliminada correctamente' };
    } catch (error) {
      this.logger.error(`Error al eliminar compra: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error interno al eliminar compra', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
