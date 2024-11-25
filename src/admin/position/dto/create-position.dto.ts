import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionDto {
  @IsNotEmpty({ message: 'Position name is required' })
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
