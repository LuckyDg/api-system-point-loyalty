import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RedeemRewardDto } from './dto/redeem-reward.dto';
import { Reward, RewardDocument } from './entities/reward.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/entities/user.schema';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<Reward[]> {
    return this.rewardModel.find().exec();
  }

  async redeem(dto: RedeemRewardDto): Promise<Reward> {
    const user = await this.userModel.findById(dto.userId);
    if (!user) throw new NotFoundException('User not found');
  
    if (user.loyaltyPoints < dto.pointsUsed) {
      throw new BadRequestException('Insufficient points');
    }
  
    user.loyaltyPoints -= dto.pointsUsed;
    await user.save();
  
    return this.rewardModel.create({
      userId: dto.userId,
      pointsUsed: dto.pointsUsed,
      rewardDescription: dto.rewardDescription,
    });
  }
  
}
