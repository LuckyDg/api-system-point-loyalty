import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/entities/user.schema';
import { Purchase, PurchaseDocument } from './entities/purchase.schema';
import { Model } from 'mongoose';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreatePurchaseDto): Promise<Purchase> {
    const purchase = await this.purchaseModel.create(dto);

    await this.userModel.findByIdAndUpdate(dto.userId, {
      $inc: { loyaltyPoints: dto.pointsEarned },
      $push: { purchaseHistory: purchase._id.toString() },
    });

    return purchase;
  }

  async findByUser(userId: string): Promise<Purchase[]> {
    return this.purchaseModel.find({ userId }).exec();
  }
}
