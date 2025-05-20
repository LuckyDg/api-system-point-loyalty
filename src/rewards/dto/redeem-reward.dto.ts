import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class RedeemRewardDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @Min(1)
  pointsUsed: number;

  @IsString()
  @IsNotEmpty()
  rewardDescription: string;
}