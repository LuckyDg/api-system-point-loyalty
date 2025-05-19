import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environment } from 'environments';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { config } from './config/config';

@Module({
  imports: [ConfigModule.forRoot({
      envFilePath: environment[process.env.NODE_ENV || '.env'],
      isGlobal: true,
      load: [config],
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
