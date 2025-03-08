import { Get, Controller, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import AssetService from '../services/asset.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('/api/v1/assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @ApiTags('assets')
  @Get('/')
  @ApiOperation({ description: 'Get all assets' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async getAllAssets() {
    return await this.assetService.findAllAssets({});
  }
}
