import { IsArray, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePurchaseDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  productIds: string[];

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsNumber()
  @Min(0)
  pointsEarned: number;
}