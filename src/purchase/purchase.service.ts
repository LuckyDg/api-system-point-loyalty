import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/entities/user.schema';
import { Purchase, PurchaseDocument } from './entities/purchase.schema';
import { Model } from 'mongoose';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreatePurchaseDto): Promise<Purchase> {
    try {
      const purchase = await this.purchaseModel.create(dto);
      await this.userModel.findByIdAndUpdate(dto.userId, {
        $inc: { loyaltyPoints: dto.pointsEarned },
        $push: { purchaseHistory: purchase._id.toString() },
      });
      this.logger.log(`Compra creada para usuario ${dto.userId}`);
      return purchase;
    } catch (error) {
      this.logger.error(`Error al crear compra: ${error.message}`);
      throw new InternalServerErrorException('No se pudo crear la compra');
    }
  }

  async findByUser(userId: string): Promise<Purchase[]> {
    try {
      return await this.purchaseModel.find({ userId }).exec();
    } catch (error) {
      this.logger.error(`Error al buscar compras del usuario ${userId}: ${error.message}`);
      throw new InternalServerErrorException('No se pudieron obtener las compras del usuario');
    }
  }

  async findOne(id: string): Promise<Purchase> {
    try {
      const purchase = await this.purchaseModel.findById(id).exec();
      if (!purchase) throw new NotFoundException('Compra no encontrada');
      return purchase;
    } catch (error) {
      this.logger.error(`Error al buscar compra ${id}: ${error.message}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('No se pudo obtener la compra');
    }
  }

  async update(id: string, dto: Partial<CreatePurchaseDto>): Promise<Purchase> {
    try {
      const purchase = await this.purchaseModel.findByIdAndUpdate(id, dto, { new: true }).exec();
      if (!purchase) throw new NotFoundException('Compra no encontrada');
      this.logger.log(`Compra ${id} actualizada`);
      return purchase;
    } catch (error) {
      this.logger.error(`Error al actualizar compra ${id}: ${error.message}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('No se pudo actualizar la compra');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const purchase = await this.purchaseModel.findByIdAndDelete(id).exec();
      if (!purchase) throw new NotFoundException('Compra no encontrada');
      this.logger.log(`Compra ${id} eliminada`);
    } catch (error) {
      this.logger.error(`Error al eliminar compra ${id}: ${error.message}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('No se pudo eliminar la compra');
    }
  }
}
