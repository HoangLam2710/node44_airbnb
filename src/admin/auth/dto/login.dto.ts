import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty()
  password: string;
}
