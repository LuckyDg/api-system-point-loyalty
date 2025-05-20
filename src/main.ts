import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Api-System-Point-Loyalty');
  const app = await NestFactory.create(AppModule);
  app.enableCors(
    {
      origin: process.env.ORIGIN,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    }
  );
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true
    }
  ));

  // Configuración básica de Swagger
  const config = new DocumentBuilder()
    .setTitle('API De Puntos de Fidelidad')
    .setDescription('API para la gestión de puntos de fidelidad')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme'
      }
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
