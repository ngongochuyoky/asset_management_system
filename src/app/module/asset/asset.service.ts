import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import Asset from '../entity/asset.entity';
@Injectable()
export default class AssetService {
  constructor(
    @InjectRepository(Asset)
    readonly repository: Repository<Asset>,
  ) {}

  async findAllAssets(findAllOptions: FindManyOptions<Asset>) {
    return await this.repository.find(findAllOptions);
  }

  async findAssetBySerial(serial: string) {
    return await this.repository.findOne({
      where: { serial },
      relations: ['location', 'location.organization'],
    });
  }

  async createAsset(assetData: Partial<CreateAssetDto>) {
    const asset = this.repository.create(assetData);
    return await this.repository.save(asset);
  }

  async updateAsset(serial: string, assetData: Partial<UpdateAssetDto>) {
    await this.repository.update({ serial }, assetData);
    return this.findAssetBySerial(serial);
  }

  async deleteAsset(serial: string) {
    const asset = await this.findAssetBySerial(serial);
    if (!asset) {
      throw new Error('Asset not found');
    }
    return await this.repository.remove(asset);
  }
}
