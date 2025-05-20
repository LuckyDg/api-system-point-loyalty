import { Test, TestingModule } from '@nestjs/testing';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RewardsController', () => {
  let controller: RewardsController;
  let service: RewardsService;

  const mockRewardsService = {
    findAll: jest.fn(),
    redeem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardsController],
      providers: [
        { provide: RewardsService, useValue: mockRewardsService },
      ],
    }).compile();

    controller = module.get<RewardsController>(RewardsController);
    service = module.get<RewardsService>(RewardsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar todas las recompensas', async () => {
      const rewards = [{ _id: '1', rewardDescription: 'desc' }];
      mockRewardsService.findAll.mockResolvedValue(rewards);
      const result = await controller.findAll();
      expect(result).toEqual(rewards);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('redeem', () => {
    const dto = { userId: 'u1', pointsUsed: 10, rewardDescription: 'desc' };
    it('debe canjear la recompensa', async () => {
      const reward = { _id: 'r1', ...dto };
      mockRewardsService.redeem.mockResolvedValue(reward);
      const result = await controller.redeem(dto as any);
      expect(result).toEqual(reward);
      expect(service.redeem).toHaveBeenCalledWith(dto);
    });
    it('debe propagar NotFoundException si el usuario no existe', async () => {
      mockRewardsService.redeem.mockRejectedValue(new NotFoundException());
      await expect(controller.redeem(dto as any)).rejects.toThrow(NotFoundException);
    });
    it('debe propagar BadRequestException si puntos insuficientes', async () => {
      mockRewardsService.redeem.mockRejectedValue(new BadRequestException());
      await expect(controller.redeem(dto as any)).rejects.toThrow(BadRequestException);
    });
  });
});
