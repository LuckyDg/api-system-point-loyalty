import { IsArray, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'IDs de los productos' })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  productIds: string[];

  @ApiProperty({ description: 'Monto total de la compra' })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ description: 'Puntos ganados por la compra' })
  @IsNumber()
  @Min(0)
  pointsEarned: number;
}