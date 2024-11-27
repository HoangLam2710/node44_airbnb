import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @IsNotEmpty({ message: 'Content is required' })
  @ApiProperty()
  content: string;

  @IsNotEmpty({ message: 'Rate is required' })
  @ApiProperty()
  rate: number;
}
