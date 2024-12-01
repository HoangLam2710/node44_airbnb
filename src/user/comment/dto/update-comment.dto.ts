import { IsNotEmpty, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  uid: string;

  @IsNotEmpty({ message: 'Content is required' })
  @ApiProperty()
  content: string;

  @IsNotEmpty({ message: 'Rate is required' })
  @Min(0, { message: 'Rate must be greater than or equal to 0' })
  @Max(5, { message: 'Rate must be less than or equal to 5' })
  @ApiProperty()
  rate: number;
}
