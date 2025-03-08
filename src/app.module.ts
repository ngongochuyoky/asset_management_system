import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app/controllers/app.controller';
import { DomainModule } from './app/module/entity.module';
import { ConfigModule } from './config/config.module';
import { AppLoggerModule } from './logger/logger.module';
@Module({
  imports: [
    ConfigModule,
    DomainModule,
    AppLoggerModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule {}
