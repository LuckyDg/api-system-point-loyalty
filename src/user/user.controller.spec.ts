import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpException, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser = {
    _id: '123',
    email: 'test@example.com',
    name: 'Test User',
    loyaltyPoints: 20,
  };

  const mockService = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    getLoyaltyPoints: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('debe retornar mensaje y usuario al crear exitosamente', async () => {
      mockService.create.mockResolvedValue(mockUser);
      const result = await controller.create({ email: mockUser.email } as any);
      expect(result).toEqual({
        message: 'Usuario creado correctamente',
        user: mockUser,
      });
    });

    it('debe lanzar excepción interna si falla el servicio', async () => {
      mockService.create.mockRejectedValue(new Error('fail'));
      await expect(controller.create({ email: 'test' } as any)).rejects.toThrow(HttpException);
    });
  });

  describe('findOne()', () => {
    it('debe retornar un usuario por id', async () => {
      mockService.findById.mockResolvedValue(mockUser);
      const result = await controller.findOne('123');
      expect(result).toEqual(mockUser);
    });

    it('debe lanzar HttpException si falla internamente', async () => {
      mockService.findById.mockRejectedValue(new Error('fail'));
      await expect(controller.findOne('123')).rejects.toThrow(HttpException);
    });
  });

  describe('update()', () => {
    it('debe retornar mensaje y usuario actualizado', async () => {
      mockService.update.mockResolvedValue({ ...mockUser, name: 'Updated' });
      const result = await controller.update('123', { name: 'Updated' } as any);
      expect(result).toEqual({
        message: 'Usuario actualizado correctamente',
        user: { ...mockUser, name: 'Updated' },
      });
    });

    it('debe lanzar excepción interna si update falla', async () => {
      mockService.update.mockRejectedValue(new Error('fail'));
      await expect(controller.update('123', {} as any)).rejects.toThrow(HttpException);
    });
  });

  describe('getPoints()', () => {
    it('debe retornar los puntos del usuario', async () => {
      mockService.getLoyaltyPoints.mockResolvedValue(30);
      const result = await controller.getPoints('123');
      expect(result).toEqual({ userId: '123', loyaltyPoints: 30 });
    });

    it('debe lanzar excepción interna si getLoyaltyPoints falla', async () => {
      mockService.getLoyaltyPoints.mockRejectedValue(new Error('fail'));
      await expect(controller.getPoints('123')).rejects.toThrow(HttpException);
    });
  });
});
