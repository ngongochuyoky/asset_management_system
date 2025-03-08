import { Module } from '@nestjs/common';
import { AppController } from './app/controllers/app.controller';
import { DomainModule } from './app/module/entity.module';
import { ConfigModule } from './config/config.module';
import { AppLoggerModule } from './logger/logger.module';
import { CronJobModule } from './app/cron-jobs/cron-job.module';
@Module({
  imports: [ConfigModule, DomainModule, AppLoggerModule, CronJobModule],
  controllers: [AppController],
})
export class AppModule {}
