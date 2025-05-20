import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { Product } from './entities/product.schema';
import { ConflictException, NotFoundException, Logger } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let productModel: any;
  let loggerLogSpy: jest.SpyInstance;
  let loggerWarnSpy: jest.SpyInstance;

  const mockProductModel = () => ({
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getModelToken(Product.name), useFactory: mockProductModel },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productModel = module.get(getModelToken(Product.name));
    loggerLogSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar todos los productos y loguear', async () => {
      const productos = [{ _id: '1', name: 'A' }];
      productModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(productos) });
      const result = await service.findAll();
      expect(result).toEqual(productos);
      expect(loggerLogSpy).toHaveBeenCalledWith('Obteniendo todos los productos');
    });
  });

  describe('findById', () => {
    it('debe retornar el producto y loguear', async () => {
      const producto = { _id: '1', name: 'A' };
      productModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(producto) });
      const result = await service.findById('1');
      expect(result).toEqual(producto);
      expect(loggerLogSpy).toHaveBeenCalledWith('Buscando producto con id: 1');
    });
    it('debe lanzar NotFoundException y loguear si no existe', async () => {
      productModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
      expect(loggerWarnSpy).toHaveBeenCalledWith('Producto no encontrado: 1');
    });
  });

  describe('create', () => {
    it('debe crear el producto y loguear', async () => {
      const dto = { name: 'A', price: 10, stock: 1 };
      productModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      productModel.create.mockResolvedValue({ _id: '1', ...dto });
      const result = await service.create(dto as any);
      expect(result).toEqual({ _id: '1', ...dto });
      expect(loggerLogSpy).toHaveBeenCalledWith(`Creando producto: ${JSON.stringify(dto)}`);
    });
    it('debe lanzar ConflictException y loguear si el nombre ya existe', async () => {
      const dto = { name: 'A', price: 10, stock: 1 };
      productModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: '1', ...dto }) });
      await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
      expect(loggerWarnSpy).toHaveBeenCalledWith('Intento de crear producto duplicado: A');
    });
  });

  describe('update', () => {
    it('debe actualizar el producto y loguear', async () => {
      const dto = { price: 20 };
      const producto = { _id: '1', name: 'A', price: 20 };
      productModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(producto) });
      const result = await service.update('1', dto as any);
      expect(result).toEqual(producto);
      expect(loggerLogSpy).toHaveBeenCalledWith(`Actualizando producto 1 con: ${JSON.stringify(dto)}`);
    });
    it('debe lanzar NotFoundException y loguear si no existe', async () => {
      productModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.update('1', {} as any)).rejects.toThrow(NotFoundException);
      expect(loggerWarnSpy).toHaveBeenCalledWith('Producto no encontrado para actualizar: 1');
    });
  });

  describe('delete', () => {
    it('debe eliminar el producto y loguear', async () => {
      const producto = { _id: '1', name: 'A' };
      productModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(producto) });
      const result = await service.delete('1');
      expect(result).toEqual(producto);
      expect(loggerLogSpy).toHaveBeenCalledWith('Eliminando producto con id: 1');
    });
    it('debe lanzar NotFoundException y loguear si no existe', async () => {
      productModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
      expect(loggerWarnSpy).toHaveBeenCalledWith('Producto no encontrado para eliminar: 1');
    });
  });
});
