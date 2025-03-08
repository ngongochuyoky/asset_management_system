import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Location from '../entity/location.entity';

@Injectable()
export default class LocationService {
  constructor(
    @InjectRepository(Location) readonly repository: Repository<Location>,
  ) {}

  async findAllLocations() {
    return await this.repository.find();
  }

  async findLocationById(id: number) {
    return await this.repository.findOne(id);
  }

  async deleteLocation(id: number) {
    const location = await this.findLocationById(id);
    if (!location) {
      throw new Error('Location not found');
    }
    return await this.repository.remove(location);
  }
}
