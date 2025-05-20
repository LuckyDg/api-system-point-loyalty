import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { HttpException, NotFoundException } from '@nestjs/common';

describe('PurchaseController', () => {
  let controller: PurchaseController;
  let service: jest.Mocked<PurchaseService>;

  const mockService = () => ({
    create: jest.fn(),
    findByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [
        { provide: PurchaseService, useFactory: mockService },
      ],
    }).compile();

    controller = module.get<PurchaseController>(PurchaseController);
    service = module.get(PurchaseService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a purchase and return message', async () => {
      const dto = { userId: 'user1', productIds: ['p1'], totalAmount: 100, pointsEarned: 10 };
      const purchase = { _id: 'id1', ...dto };
      service.create.mockResolvedValue(purchase as any);
      const result = await controller.create(dto as any);
      expect(result).toEqual({ message: 'Compra creada correctamente', purchase });
    });
    it('should throw HttpException on error', async () => {
      service.create.mockRejectedValue(new Error('fail'));
      await expect(controller.create({} as any)).rejects.toThrow(HttpException);
    });
  });

  describe('findByUser', () => {
    it('should return purchases for a user', async () => {
      const purchases = [{ _id: 'id1' }];
      service.findByUser.mockResolvedValue(purchases as any);
      const result = await controller.findByUser('user1');
      expect(result).toEqual(purchases);
    });
    it('should throw HttpException on error', async () => {
      service.findByUser.mockRejectedValue(new Error('fail'));
      await expect(controller.findByUser('user1')).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return a purchase by id', async () => {
      const purchase = { _id: 'id1' };
      service.findOne.mockResolvedValue(purchase as any);
      const result = await controller.findOne('id1');
      expect(result).toEqual(purchase);
    });
    it('should throw HttpException on error', async () => {
      service.findOne.mockRejectedValue(new Error('fail'));
      await expect(controller.findOne('id1')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update and return the purchase', async () => {
      const dto = { totalAmount: 200 };
      const updated = { _id: 'id1', ...dto };
      service.update.mockResolvedValue(updated as any);
      const result = await controller.update('id1', dto);
      expect(result).toEqual({ message: 'Compra actualizada correctamente', purchase: updated });
    });
  
    it('should throw HttpException on error', async () => {
      service.update.mockRejectedValue(new Error('fail'));
      await expect(controller.update('id1', {} as any)).rejects.toThrow(HttpException);
    });
  });
  
  describe('remove', () => {
    it('should remove a purchase', async () => {
      service.remove.mockResolvedValue(undefined);
      const result = await controller.remove('id1');
      expect(result).toEqual({ message: 'Compra eliminada correctamente' });
    });
  
    it('should throw HttpException on error', async () => {
      service.remove.mockRejectedValue(new Error('fail'));
      await expect(controller.remove('id1')).rejects.toThrow(HttpException);
    });
  });
});
