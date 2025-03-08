import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import Asset from '../entity/asset.entity';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';
import Location from '../entity/location.entity';
import * as dotenv from 'dotenv';
import { AssetStatus } from '../../util/enum/asset-status.enum';
import { CreateAssetDto } from '../dto/create-asset.dto';
import { UpdateAssetDto } from '../dto/update-asset.dto';

dotenv.config(); // Load biến môi trường từ .env

@Injectable()
export default class AssetService {
  private readonly assetApiUrl = process.env.ASSET_API_URL || '';

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async findAllAssets(findAllOptions: FindManyOptions<Asset>) {
    return await this.assetRepository.find(findAllOptions);
  }

  async findAssetBySerial(serial: string) {
    return await this.assetRepository.findOne({
      where: { serial },
      relations: ['location', 'location.organization'],
    });
  }

  async createAsset(assetData: Partial<CreateAssetDto>) {
    const asset = this.assetRepository.create(assetData);
    return await this.assetRepository.save(asset);
  }

  async updateAsset(serial: string, assetData: Partial<UpdateAssetDto>) {
    await this.assetRepository.update({ serial }, assetData);
    return this.findAssetBySerial(serial);
  }

  async deleteAsset(serial: string) {
    const asset = await this.findAssetBySerial(serial);
    if (!asset) {
      throw new Error('Asset not found');
    }
    return await this.assetRepository.remove(asset);
  }

  @Cron('0 0 * * *') // Chạy lúc 00:00 mỗi ngày
  async syncAssetsFromAPI() {
    console.log('🚀 Starting asset synchronization...');
    if (!this.assetApiUrl) {
      console.error('ASSET_API_URL is not set in .env file');
      return;
    }

    const queryRunner =
      this.assetRepository.manager.connection.createQueryRunner();
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

      const locations = await this.locationRepository.find();
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

          const assetEntity = this.assetRepository.create({
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
        await this.assetRepository.upsert(assetEntities, ['serial']);
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
