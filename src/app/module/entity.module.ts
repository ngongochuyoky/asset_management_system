import { Module, Type } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DbModule } from '../../db/db.module';
import { CronJobModule } from '../cron-jobs/cron-job.module';
import { AssetModule } from './asset/asset.module';
import { LocationModule } from './location/location.module';
import { OrganizationModule } from './organization/organization.module';

export const ALL_ENTITIES = fs
  .readdirSync(path.join(path.dirname(__filename), 'entity'))
  .map((file) => require(`./entity/${file}`).default as Type<any>);

@Module({
  imports: [
    DbModule.forRoot({ entities: ALL_ENTITIES }),
    AssetModule,
    LocationModule,
    OrganizationModule,
    CronJobModule,
  ],
})
export class DomainModule {}
