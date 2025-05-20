import { Injectable, NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(): Promise<Product[]> {
    this.logger.log('Obteniendo todos los productos');
    return this.productModel.find().exec();
  }

  async findById(id: string): Promise<Product> {
    this.logger.log(`Buscando producto con id: ${id}`);
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      this.logger.warn(`Producto no encontrado: ${id}`);
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    this.logger.log(`Creando producto: ${JSON.stringify(dto)}`);
    // Evitar productos duplicados por nombre
    const exists = await this.productModel.findOne({ name: dto.name }).exec();
    if (exists) {
      this.logger.warn(`Intento de crear producto duplicado: ${dto.name}`);
      throw new ConflictException('Ya existe un producto con ese nombre');
    }
    return this.productModel.create(dto);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    this.logger.log(`Actualizando producto ${id} con: ${JSON.stringify(dto)}`);
    const updated = await this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) {
      this.logger.warn(`Producto no encontrado para actualizar: ${id}`);
      throw new NotFoundException('Product not found');
    }
    return updated;
  }

  async delete(id: string): Promise<Product> {
    this.logger.log(`Eliminando producto con id: ${id}`);
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      this.logger.warn(`Producto no encontrado para eliminar: ${id}`);
      throw new NotFoundException('Product not found');
    }
    return deleted;
  }
}
