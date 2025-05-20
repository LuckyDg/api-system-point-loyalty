import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RedeemRewardDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Puntos usados' })
  @IsNumber()
  @Min(1)
  pointsUsed: number;
    
  @ApiProperty({ description: 'Descripción de la recompensa' })
  @IsString()
  @IsNotEmpty()
  rewardDescription: string;
}