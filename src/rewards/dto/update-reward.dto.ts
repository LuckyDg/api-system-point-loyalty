import { PartialType } from '@nestjs/mapped-types';
import { RedeemRewardDto } from './redeem-reward.dto';

export class UpdateRewardDto extends PartialType(RedeemRewardDto) {}
