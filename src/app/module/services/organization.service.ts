import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Organization from '../entity/organization.entity';

@Injectable()
export default class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async findAllOrganizations() {
    return await this.organizationRepository.find();
  }

  async findOrganizationById(id: number) {
    return await this.organizationRepository.findOne(id);
  }

  async deleteOrganization(id: number) {
    await this.organizationRepository.delete(id);
  }
}
