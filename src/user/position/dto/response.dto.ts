import { Exclude } from 'class-transformer';

export class ResponsePositionDto {
  @Exclude()
  status: string;
}
