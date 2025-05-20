import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.schema';

describe('UserService', () => {
  let service: UserService;
  let model: any;

  const mockUser = {
    _id: '123',
    email: 'test@example.com',
    name: 'Test User',
    loyaltyPoints: 50,
  };

  const userModelMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: userModelMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get(getModelToken(User.name));
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('debe crear un usuario si no existe el email', async () => {
      model.findOne.mockResolvedValue(null);
      model.create.mockResolvedValue(mockUser);
      const result = await service.create({ email: mockUser.email } as any);
      expect(result).toEqual(mockUser);
    });

    it('debe lanzar ConflictException si el email ya existe', async () => {
      model.findOne.mockResolvedValue(mockUser);
      await expect(service.create({ email: mockUser.email } as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('findById()', () => {
    it('debe retornar un usuario existente', async () => {
      model.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) });
      const result = await service.findById('123');
      expect(result).toEqual(mockUser);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      model.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.findById('123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('debe actualizar el usuario si existe', async () => {
      service.findById = jest.fn().mockResolvedValue(mockUser); // simula que sí existe
      model.findByIdAndUpdate.mockResolvedValue({ ...mockUser, name: 'Updated' });
      const result = await service.update('123', { name: 'Updated' } as any);
      expect(result.name).toBe('Updated');
    });

    it('debe lanzar NotFoundException si no se encuentra al actualizar', async () => {
      service.findById = jest.fn().mockResolvedValue(mockUser);
      model.findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.update('123', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getLoyaltyPoints()', () => {
    it('debe retornar los puntos de lealtad', async () => {
      service.findById = jest.fn().mockResolvedValue(mockUser);
      const result = await service.getLoyaltyPoints('123');
      expect(result).toBe(50);
    });

    it('debe retornar 0 si loyaltyPoints es undefined', async () => {
      service.findById = jest.fn().mockResolvedValue({ ...mockUser, loyaltyPoints: undefined });
      const result = await service.getLoyaltyPoints('123');
      expect(result).toBe(0);
    });
  });
});
