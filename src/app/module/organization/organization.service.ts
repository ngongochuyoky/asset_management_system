import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Organization from '../entity/organization.entity';

@Injectable()
export default class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    readonly repository: Repository<Organization>,
  ) {}

  async findAllOrganizations() {
    return await this.repository.find();
  }

  async findOrganizationById(id: number) {
    return await this.repository.findOne(id);
  }

  async deleteOrganization(id: number) {
    await this.repository.delete(id);
  }
}
