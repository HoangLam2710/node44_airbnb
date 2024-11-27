import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  uid: string;

  @IsNotEmpty({ message: 'rid is required' })
  @ApiProperty()
  rid: string;

  @IsNotEmpty({ message: 'Content is required' })
  @ApiProperty()
  content: string;

  @IsNotEmpty({ message: 'Rate is required' })
  @ApiProperty()
  rate: number;
}
