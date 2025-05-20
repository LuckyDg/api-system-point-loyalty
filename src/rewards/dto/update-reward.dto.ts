import { PartialType } from '@nestjs/swagger';
import { RedeemRewardDto } from './redeem-reward.dto';

export class UpdateRewardDto extends PartialType(RedeemRewardDto) {}
