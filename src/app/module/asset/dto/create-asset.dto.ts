import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssetStatus } from '../../../util/enum/asset-status.enum';

export class CreateAssetDto {
  @ApiProperty({
    description: 'Type of the asset',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty({
    description: 'Unique serial number of the asset',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  serial!: string;

  @ApiProperty({
    description: 'Status of the asset',
    enum: AssetStatus,
    default: AssetStatus.ACTIVE,
  })
  @IsEnum(AssetStatus)
  @IsOptional()
  status: AssetStatus = AssetStatus.ACTIVE;

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
    type: String,
  })
  @IsUUID()
  locationId!: string;
}
