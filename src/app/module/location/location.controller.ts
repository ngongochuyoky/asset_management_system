import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import LocationService from './location.service';

@ApiTags('locations')
@Controller('/api/v1/locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiOperation({ description: 'Get all locations' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllLocations() {
    return await this.locationService.findAllLocations();
  }

  @ApiOperation({ description: 'Get a location by ID' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getLocationById(@Param('id') id: number) {
    return await this.locationService.findLocationById(id);
  }

  @ApiOperation({ description: 'Delete a location by ID' })
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLocation(@Param('id') id: number) {
    await this.locationService.deleteLocation(id);
  }
}
