import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar todos los productos', async () => {
      const productos = [{ _id: '1', name: 'A' }];
      mockProductService.findAll.mockResolvedValue(productos);
      const result = await controller.findAll();
      expect(result).toEqual(productos);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debe retornar el producto', async () => {
      const producto = { _id: '1', name: 'A' };
      mockProductService.findById.mockResolvedValue(producto);
      const result = await controller.findOne('1');
      expect(result).toEqual(producto);
      expect(service.findById).toHaveBeenCalledWith('1');
    });
    it('debe propagar NotFoundException', async () => {
      mockProductService.findById.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('debe crear el producto', async () => {
      const dto = { name: 'A', price: 10, stock: 1 };
      const producto = { _id: '1', ...dto };
      mockProductService.create.mockResolvedValue(producto);
      const result = await controller.create(dto as any);
      expect(result).toEqual(producto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
    it('debe propagar ConflictException si el nombre ya existe', async () => {
      mockProductService.create.mockRejectedValue(new ConflictException());
      await expect(controller.create({ name: 'A', price: 10, stock: 1 } as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('debe actualizar el producto', async () => {
      const dto = { price: 20 };
      const producto = { _id: '1', name: 'A', price: 20 };
      mockProductService.update.mockResolvedValue(producto);
      const result = await controller.update('1', dto as any);
      expect(result).toEqual(producto);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
    it('debe propagar NotFoundException si no existe', async () => {
      mockProductService.update.mockRejectedValue(new NotFoundException());
      await expect(controller.update('1', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('debe eliminar el producto', async () => {
      const producto = { _id: '1', name: 'A' };
      mockProductService.delete.mockResolvedValue(producto);
      const result = await controller.delete('1');
      expect(result).toEqual(producto);
      expect(service.delete).toHaveBeenCalledWith('1');
    });
    it('debe propagar NotFoundException si no existe', async () => {
      mockProductService.delete.mockRejectedValue(new NotFoundException());
      await expect(controller.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});
