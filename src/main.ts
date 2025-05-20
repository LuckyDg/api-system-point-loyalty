import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

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
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
