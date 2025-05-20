import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { User, UserDocument } from './entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Intentando crear usuario con email: ${createUserDto.email}`);
    const exists = await this.userModel.findOne({ email: createUserDto.email });
    if (exists) {
      this.logger.warn(`Intento de registro con email ya existente: ${createUserDto.email}`);
      throw new ConflictException('El email ya está registrado');
    }
    const user = await this.userModel.create(createUserDto);
    this.logger.log(`Usuario creado con id: ${user._id}`);
    return user;
  }

  async findById(id: string): Promise<User> {
    this.logger.log(`Buscando usuario con id: ${id}`);
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      this.logger.warn(`Usuario no encontrado con id: ${id}`);
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Actualizando usuario con id: ${id}`);
    await this.findById(id);
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!updatedUser) {
      this.logger.warn(`Usuario no encontrado al actualizar con id: ${id}`);
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    this.logger.log(`Usuario actualizado con id: ${id}`);
    return updatedUser;
  }

  async getLoyaltyPoints(id: string): Promise<number> {
    this.logger.log(`Consultando puntos de lealtad para usuario con id: ${id}`);
    const user = await this.findById(id);
    return user?.loyaltyPoints ?? 0;
  }
}
