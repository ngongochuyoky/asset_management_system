import { Module, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from '../../db/db.module';
import * as fs from 'fs';
import * as path from 'path';
import { AssetController } from './controllers/asset.controller';
import Asset from './entity/asset.entity';
import Organization from './entity/organization.entity';
import Location from './entity/location.entity';
import { LocationController } from './controllers/location.controller';
import { OrganizationController } from './controllers/organization.controller';

export const ALL_ENTITIES = fs
  .readdirSync(path.join(path.dirname(__filename), 'entity'))
  .map((file) => require(`./entity/${file}`).default as Type<any>);

export const ALL_SERVICES = fs
  .readdirSync(path.join(path.dirname(__filename), 'services'))
  .filter(
    (file) =>
      (path.extname(file) === '.js' || path.extname(file) === '.ts') &&
      !file.endsWith('.d.ts'),
  )
  .filter((file) => file.indexOf('.spec') === -1)
  .map((file) => require(`./services/${file}`).default as Type<any>);

@Module({
  imports: [
    DbModule.forRoot({ entities: ALL_ENTITIES }),
    TypeOrmModule.forFeature([Asset, Organization, Location]),
  ],
  providers: [...ALL_SERVICES],
  exports: [...ALL_SERVICES],
  controllers: [AssetController, LocationController, OrganizationController],
})
export class DomainModule {}
