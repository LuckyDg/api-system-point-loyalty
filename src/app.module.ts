import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environment } from 'environments';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { config } from './config/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { validationSchema } from './config/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environment[process.env.NODE_ENV || '.env'],
      isGlobal: true,
      load: [config],
      validationSchema,
    }),
    DatabaseModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
