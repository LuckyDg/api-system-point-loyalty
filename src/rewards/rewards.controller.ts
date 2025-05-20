import { Controller, Get, Post, Body} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RedeemRewardDto } from './dto/redeem-reward.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Rewards')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las recompensas' })
  @ApiResponse({ status: 200, description: 'Recompensas obtenidas correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno al obtener recompensas.' })
  findAll() {
    return this.rewardsService.findAll();
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Canjear recompensas' })
  @ApiResponse({ status: 200, description: 'Recompensa canjeada correctamente.' })
  @ApiResponse({ status: 400, description: 'Puntos insuficientes o usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno al canjear recompensa.' })
  redeem(@Body() dto: RedeemRewardDto) {
    return this.rewardsService.redeem(dto);
  }
}
