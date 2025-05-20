import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { RedeemRewardDto } from './dto/redeem-reward.dto';
import { Reward, RewardDocument } from './entities/reward.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/entities/user.schema';

@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<Reward[]> {
    this.logger.log('Obteniendo todas las recompensas');
    return this.rewardModel.find().exec();
  }

  async redeem(dto: RedeemRewardDto): Promise<Reward> {
    this.logger.log(`Intentando canjear recompensa para usuario: ${dto.userId}`);
    const user = await this.userModel.findById(dto.userId);
    if (!user) {
      this.logger.warn(`Usuario no encontrado: ${dto.userId}`);
      throw new NotFoundException('User not found');
    }
    if (user.loyaltyPoints < dto.pointsUsed) {
      this.logger.warn(`Puntos insuficientes para usuario: ${dto.userId}`);
      throw new BadRequestException('Insufficient points');
    }
    user.loyaltyPoints -= dto.pointsUsed;
    await user.save();
    this.logger.log(`Recompensa canjeada: ${dto.rewardDescription} para usuario: ${dto.userId}`);
    return this.rewardModel.create({
      userId: dto.userId,
      pointsUsed: dto.pointsUsed,
      rewardDescription: dto.rewardDescription,
    });
  }
}
