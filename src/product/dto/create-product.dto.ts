import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Precio del producto' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Stock del producto' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ description: 'Categoría del producto' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Descripción del producto' })
  @IsString()
  @IsOptional()
  description?: string;
}