import { Controller, Get, Post, Body} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RedeemRewardDto } from './dto/redeem-reward.dto';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  findAll() {
    return this.rewardsService.findAll();
  }

  @Post('redeem')
  redeem(@Body() dto: RedeemRewardDto) {
    return this.rewardsService.redeem(dto);
  }
}
