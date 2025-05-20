import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdProductId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /product - debe crear un producto', async () => {
    const dto = { name: 'TestProduct', price: 100, stock: 10 };
    const res = await request(app.getHttpServer())
      .post('/product')
      .send(dto)
      .expect(201);
    expect(res.body).toMatchObject(dto);
    expect(res.body._id).toBeDefined();
    createdProductId = res.body._id;
  });

  it('GET /product/:id - debe obtener el producto creado', async () => {
    const res = await request(app.getHttpServer())
      .get(`/product/${createdProductId}`)
      .expect(200);
    expect(res.body._id).toBe(createdProductId);
    expect(res.body.name).toBe('TestProduct');
    expect(res.body.price).toBe(100);
  });

  it('PATCH /product/:id - debe actualizar el producto', async () => {
    const updateDto = { price: 150, stock: 20 };
    const res = await request(app.getHttpServer())
      .patch(`/product/${createdProductId}`)
      .send(updateDto)
      .expect(200);
    expect(res.body.price).toBe(150);
    expect(res.body.stock).toBe(20);
  });

  it('DELETE /product/:id - debe eliminar el producto', async () => {
    await request(app.getHttpServer())
      .delete(`/product/${createdProductId}`)
      .expect(200);

    // Confirmar que ya no existe
    await request(app.getHttpServer())
      .get(`/product/${createdProductId}`)
      .expect(404);
  });

  it('GET /rewards - debe responder con un array (aunque esté vacío)', async () => {
    const res = await request(app.getHttpServer())
      .get('/rewards')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
