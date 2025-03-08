import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import AssetService from '../module/asset/asset.service';
import Asset from '../module/entity/asset.entity';
import LocationService from '../module/location/location.service';
import { AssetStatus } from '../util/enum/asset-status.enum';

@Injectable()
export class CronJobService {
  private readonly assetApiUrl = process.env.ASSET_API_URL || '';
  constructor(
    private assetService: AssetService,
    private locationService: LocationService,
  ) {}

  //   @Cron('0 0 * * *') // Chạy lúc 00:00 mỗi ngày
  @Cron('*/5 * * * * *') // Mỗi giây
  async syncAssetsFromAPI() {
    console.log('🚀 Starting asset synchronization...');
    if (!this.assetApiUrl) {
      console.error('ASSET_API_URL is not set in .env file');
      return;
    }

    const queryRunner =
      this.assetService.repository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const response = await axios.get(this.assetApiUrl);

      // Kiểm tra status của API trước khi tiếp tục
      if (response.status !== 200) {
        console.error(`API Error: Received status ${response.status}`);
        return;
      }

      const assets = response.data;
      if (!Array.isArray(assets)) {
        console.error('API Error: Invalid data format');
        return;
      }

      const locations = await this.locationService.repository.find();
      const validLocationIds = new Set(locations.map((loc) => loc.id));

      const assetEntities: Asset[] = [];

      for (const asset of assets) {
        const createdAt = new Date(asset.created_at * 1000);
        const updatedAt = new Date(asset.updated_at * 1000);

        if (
          asset.status === 'actived' &&
          createdAt < new Date() &&
          validLocationIds.has(asset.location_id)
        ) {
          console.log(`Processing asset: ${asset.serial}`);

          const assetEntity = this.assetService.repository.create({
            type: asset.type,
            serial: asset.serial,
            status: AssetStatus.ACTIVE,
            description: asset.description,
            location: { id: asset.location_id },
            createdAt,
            updatedAt,
          });

          assetEntities.push(assetEntity);
        }
      }

      if (assetEntities.length > 0) {
        await this.assetService.repository.upsert(assetEntities, ['serial']);
      }

      await queryRunner.commitTransaction();
      console.log('Asset synchronization completed successfully.');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error during asset synchronization:', error);
    } finally {
      await queryRunner.release();
    }
  }
}
