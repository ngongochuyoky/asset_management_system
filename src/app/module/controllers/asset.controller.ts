import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAssetDto } from '../dto/create-asset.dto';
import { UpdateAssetDto } from '../dto/update-asset.dto';
import AssetService from '../services/asset.service';

@ApiTags('assets')
@Controller('/api/v1/assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @ApiOperation({ description: 'Get all assets' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllAssets() {
    return await this.assetService.findAllAssets({});
  }

  @ApiOperation({ description: 'Get an asset by serial' })
  @Get('/:serial')
  @HttpCode(HttpStatus.OK)
  async getAssetBySerial(@Param('serial') serial: string) {
    return await this.assetService.findAssetBySerial(serial);
  }

  @ApiOperation({ description: 'Create a new asset' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createAsset(@Body() assetData: CreateAssetDto) {
    return await this.assetService.createAsset(assetData);
  }

  @ApiOperation({ description: 'Update an existing asset' })
  @Put('/:serial')
  @HttpCode(HttpStatus.OK)
  async updateAsset(
    @Param('serial') serial: string,
    @Body() assetData: UpdateAssetDto,
  ) {
    return await this.assetService.updateAsset(serial, assetData);
  }

  @ApiOperation({ description: 'Delete an asset by serial' })
  @Delete('/:serial')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAsset(@Param('serial') serial: string) {
    await this.assetService.deleteAsset(serial);
  }
}
