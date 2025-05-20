import { Controller, Get, Post, Body, Param, Patch, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno al crear usuario.' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() dto: CreateUserDto) {
    this.logger.log(`POST /user/register - Creando usuario con email: ${dto.email}`);
    try {
      const user = await this.usersService.create(dto);
      this.logger.log(`Usuario creado correctamente con id: ${user["_id"]}`);
      return { message: 'Usuario creado correctamente', user };
    } catch (error) {
      this.logger.error(`Error al crear usuario: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error interno al crear usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno al buscar usuario.' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  async findOne(@Param('id') id: string) {
    this.logger.log(`GET /user/${id} - Buscando usuario`);
    try {
      const user = await this.usersService.findById(id);
      return user;
    } catch (error) {
      this.logger.error(`Error al buscar usuario: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error interno al buscar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno al actualizar usuario.' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    this.logger.log(`PATCH /user/${id} - Actualizando usuario`);
    try {
      const user = await this.usersService.update(id, dto);
      this.logger.log(`Usuario actualizado correctamente con id: ${id}`);
      return { message: 'Usuario actualizado correctamente', user };
    } catch (error) {
      this.logger.error(`Error al actualizar usuario: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error interno al actualizar usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id/points')
  @ApiOperation({ summary: 'Obtener puntos de lealtad del usuario' })
  @ApiResponse({ status: 200, description: 'Puntos de lealtad obtenidos correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno al consultar puntos de lealtad.' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  async getPoints(@Param('id') id: string) {
    this.logger.log(`GET /user/${id}/points - Consultando puntos de lealtad`);
    try {
      const points = await this.usersService.getLoyaltyPoints(id);
      return { userId: id, loyaltyPoints: points };
    } catch (error) {
      this.logger.error(`Error al consultar puntos de lealtad: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error interno al consultar puntos de lealtad', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
