import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'User name is required' })
  @ApiProperty()
  name: string;

  @IsEmail({}, { message: 'Invalid email' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty()
  password: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @ApiProperty()
  phone: string;

  @ApiProperty()
  dob: Date;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  role: string;
}
