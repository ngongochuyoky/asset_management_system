import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobService } from './cron-job.service';
import { AssetModule } from '../module/asset/asset.module';
import { LocationModule } from '../module/location/location.module';

@Module({
  imports: [ScheduleModule.forRoot(), AssetModule, LocationModule],
  providers: [CronJobService],
})
export class CronJobModule {}
