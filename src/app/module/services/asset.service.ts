import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import Asset from '../entity/asset.entity';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';
import Location from '../entity/location.entity';

@Injectable()
export default class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async findAllAssets(findAllOptions: FindManyOptions<Asset>) {
    return await this.assetRepository.find(findAllOptions);
  }

  @Cron('0 0 * * *') // Chạy lúc 00:00 mỗi ngày
  async syncAssetsFromAPI() {
    console.log('🚀 Starting asset synchronization...');
    const queryRunner =
      this.assetRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const response = await axios.get(
        'https://669ce22d15704bb0e304842d.mockapi.io/assets',
      );

      // Kiểm tra status của API trước khi tiếp tục
      if (response.status !== 200) {
        console.error(`❌ API Error: Received status ${response.status}`);
        return;
      }

      const assets = response.data;
      if (!Array.isArray(assets)) {
        console.error('❌ API Error: Invalid data format');
        return;
      }

      // Lấy danh sách location ID hợp lệ trong database
      const locations = await this.locationRepository.find();
      const validLocationIds = new Set(locations.map((loc) => loc.id));

      // Tạo một tập hợp để lưu các serial đã thấy trước đó (handling seen migration data)
      const seenSerials = new Set<string>();

      for (const asset of assets) {
        const createdAt = new Date(asset.created_at * 1000); // Chuyển từ timestamp
        const updatedAt = new Date(asset.updated_at * 1000);

        if (
          asset.status === 'active' &&
          createdAt < new Date() && // Chỉ sync asset được tạo trong quá khứ
          validLocationIds.has(asset.location_id) && // Chỉ sync nếu location tồn tại
          !seenSerials.has(asset.serial) // Tránh xử lý trùng lặp
        ) {
          seenSerials.add(asset.serial); // Đánh dấu asset đã xử lý

          const existingAsset = await this.assetRepository.findOne({
            where: { serial: asset.serial },
          });

          if (!existingAsset) {
            await this.assetRepository.save({
              id: asset.id,
              type: asset.type,
              serial: asset.serial,
              status: asset.status,
              description: asset.description,
              location: { id: asset.location_id }, // Gán location theo ID
              createdAt,
              updatedAt,
            });
          }
        }
      }

      await queryRunner.commitTransaction();
      console.log('✅ Asset synchronization completed successfully.');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error during asset synchronization:', error);
    } finally {
      await queryRunner.release();
    }
  }
}
