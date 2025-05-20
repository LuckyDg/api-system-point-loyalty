import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RewardsService } from './rewards.service';
import { Reward } from './entities/reward.schema';
import { User } from '../user/entities/user.schema';
import { BadRequestException, NotFoundException, Logger } from '@nestjs/common';

describe('RewardsService', () => {
  let service: RewardsService;
  let rewardModel: any;
  let userModel: any;
  let loggerLogSpy: jest.SpyInstance;
  let loggerWarnSpy: jest.SpyInstance;

  const mockRewardModel = () => ({
    find: jest.fn(),
    create: jest.fn(),
  });
  const mockUserModel = () => ({
    findById: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        { provide: getModelToken(Reward.name), useFactory: mockRewardModel },
        { provide: getModelToken(User.name), useFactory: mockUserModel },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
    rewardModel = module.get(getModelToken(Reward.name));
    userModel = module.get(getModelToken(User.name));
    loggerLogSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar todas las recompensas y loguear', async () => {
      const rewards = [{ _id: '1', rewardDescription: 'desc' }];
      rewardModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(rewards) });
      const result = await service.findAll();
      expect(result).toEqual(rewards);
      expect(loggerLogSpy).toHaveBeenCalledWith('Obteniendo todas las recompensas');
    });
  });

  describe('redeem', () => {
    const dto = { userId: 'u1', pointsUsed: 10, rewardDescription: 'desc' };
    it('debe canjear recompensa, actualizar puntos y loguear', async () => {
      const user = { _id: 'u1', loyaltyPoints: 20, save: jest.fn() };
      userModel.findById.mockResolvedValue(user);
      rewardModel.create.mockResolvedValue({ _id: 'r1', ...dto });
      const result = await service.redeem(dto as any);
      expect(user.loyaltyPoints).toBe(10);
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual({ _id: 'r1', ...dto });
      expect(loggerLogSpy).toHaveBeenCalledWith(`Intentando canjear recompensa para usuario: ${dto.userId}`);
      expect(loggerLogSpy).toHaveBeenCalledWith(`Recompensa canjeada: ${dto.rewardDescription} para usuario: ${dto.userId}`);
    });
    it('debe lanzar NotFoundException y loguear si el usuario no existe', async () => {
      userModel.findById.mockResolvedValue(null);
      await expect(service.redeem(dto as any)).rejects.toThrow(NotFoundException);
      expect(loggerWarnSpy).toHaveBeenCalledWith(`Usuario no encontrado: ${dto.userId}`);
    });
    it('debe lanzar BadRequestException y loguear si puntos insuficientes', async () => {
      const user = { _id: 'u1', loyaltyPoints: 5, save: jest.fn() };
      userModel.findById.mockResolvedValue(user);
      await expect(service.redeem(dto as any)).rejects.toThrow(BadRequestException);
      expect(loggerWarnSpy).toHaveBeenCalledWith(`Puntos insuficientes para usuario: ${dto.userId}`);
    });
  });
});
