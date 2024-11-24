import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'User name is required' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @ApiProperty()
  phone: string;

  @ApiProperty()
  dob: Date;

  @ApiProperty()
  gender: string;
}
