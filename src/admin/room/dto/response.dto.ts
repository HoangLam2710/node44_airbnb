import { Exclude } from 'class-transformer';

export class ResponseRoomDto {
  @Exclude()
  status: string;
}
