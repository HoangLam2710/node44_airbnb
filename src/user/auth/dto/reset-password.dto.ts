import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Code is required' })
  @ApiProperty()
  code: string;

  @IsEmail({}, { message: 'Invalid email' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty()
  password: string;
}
