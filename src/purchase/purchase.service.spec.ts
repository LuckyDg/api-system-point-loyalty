import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PurchaseService } from './purchase.service';
import { Purchase } from './entities/purchase.schema';
import { User } from '../user/entities/user.schema';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

const mockPurchaseModel = () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
});

const mockUserModel = () => ({
  findByIdAndUpdate: jest.fn(),
});

describe('PurchaseService', () => {
  let service: PurchaseService;
  let purchaseModel: any;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        { provide: getModelToken(Purchase.name), useFactory: mockPurchaseModel },
        { provide: getModelToken(User.name), useFactory: mockUserModel },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
    purchaseModel = module.get(getModelToken(Purchase.name));
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a purchase and update user', async () => {
      const dto = { userId: 'user1', productIds: ['p1'], totalAmount: 100, pointsEarned: 10 };
      const purchase = { _id: 'id1', ...dto };
      purchaseModel.create.mockResolvedValue(purchase);
      userModel.findByIdAndUpdate.mockResolvedValue({});
      const result = await service.create(dto as any);
      expect(result).toEqual(purchase);
      expect(purchaseModel.create).toHaveBeenCalledWith(dto);
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(dto.userId, expect.any(Object));
    });
    it('should throw InternalServerErrorException on error', async () => {
      purchaseModel.create.mockRejectedValue(new Error('fail'));
      await expect(service.create({} as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findByUser', () => {
    it('should return purchases for a user', async () => {
      const purchases = [{ _id: 'id1' }];
      purchaseModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(purchases) });
      const result = await service.findByUser('user1');
      expect(result).toEqual(purchases);
      expect(purchaseModel.find).toHaveBeenCalledWith({ userId: 'user1' });
    });
    it('should throw InternalServerErrorException on error', async () => {
      purchaseModel.find.mockImplementation(() => { throw new Error('fail'); });
      await expect(service.findByUser('user1')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return a purchase by id', async () => {
      const purchase = { _id: 'id1' };
      purchaseModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(purchase) });
      const result = await service.findOne('id1');
      expect(result).toEqual(purchase);
    });
    it('should throw NotFoundException if not found', async () => {
      purchaseModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.findOne('id1')).rejects.toThrow(NotFoundException);
    });
    it('should throw InternalServerErrorException on error', async () => {
      purchaseModel.findById.mockImplementation(() => { throw new Error('fail'); });
      await expect(service.findOne('id1')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update and return the purchase', async () => {
      const purchase = { _id: 'id1', totalAmount: 200 };
      purchaseModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(purchase) });
      const result = await service.update('id1', { totalAmount: 200 });
      expect(result).toEqual(purchase);
    });
    it('should throw NotFoundException if not found', async () => {
      purchaseModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.update('id1', {})).rejects.toThrow(NotFoundException);
    });
    it('should throw InternalServerErrorException on error', async () => {
      purchaseModel.findByIdAndUpdate.mockImplementation(() => { throw new Error('fail'); });
      await expect(service.update('id1', {})).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should delete the purchase', async () => {
      purchaseModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: 'id1' }) });
      await expect(service.remove('id1')).resolves.toBeUndefined();
    });
    it('should throw NotFoundException if not found', async () => {
      purchaseModel.findByIdAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.remove('id1')).rejects.toThrow(NotFoundException);
    });
    it('should throw InternalServerErrorException on error', async () => {
      purchaseModel.findByIdAndDelete.mockImplementation(() => { throw new Error('fail'); });
      await expect(service.remove('id1')).rejects.toThrow(InternalServerErrorException);
    });
  });
});
