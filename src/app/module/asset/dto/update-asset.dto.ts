import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AssetStatus } from '../../../util/enum/asset-status.enum';

export class UpdateAssetDto {
  @ApiProperty({
    description: 'Type of the asset',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    description: 'Status of the asset',
    enum: AssetStatus,
    required: false,
  })
  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @ApiProperty({
    description: 'Description of the asset',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Location ID of the asset',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  locationId?: number;
}
