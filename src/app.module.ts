import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environment } from 'environments';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { config } from './config/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { validationSchema } from './config/validation';
import { PurchaseModule } from './purchase/purchase.module';
import { ProductModule } from './product/product.module';
import { RewardsModule } from './rewards/rewards.module';

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
    PurchaseModule,
    ProductModule,
    RewardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
