import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import OrganizationService from '../services/organization.service';

@ApiTags('organizations')
@Controller('/api/v1/organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOperation({ description: 'Get all organizations' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllOrganizations() {
    return await this.organizationService.findAllOrganizations();
  }

  @ApiOperation({ description: 'Get an organization by ID' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOrganizationById(@Param('id') id: number) {
    return await this.organizationService.findOrganizationById(id);
  }

  @ApiOperation({ description: 'Delete an organization by ID' })
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrganization(@Param('id') id: number) {
    await this.organizationService.deleteOrganization(id);
  }
}
