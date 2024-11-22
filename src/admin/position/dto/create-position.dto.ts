import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePositionDto {
  @IsNotEmpty({ message: 'User name is required' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'Provice is required' })
  @ApiProperty()
  provice: string;

  @IsNotEmpty({ message: 'Country is required' })
  @ApiProperty()
  country: string;

  @ApiProperty()
  images: string[];
}

export class UpdateImageDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: any[];
}
