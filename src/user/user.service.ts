import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findById(id);
  
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  
    return updatedUser;
  }

  async getLoyaltyPoints(id: string): Promise<number> {
    const user = await this.findById(id);
    return user?.loyaltyPoints ?? 0;
  }
}
