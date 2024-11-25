import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @IsNotEmpty({ message: 'Pid is required' })
  @ApiProperty()
  pid: string;

  @IsNotEmpty({ message: 'Room name is required' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'Number customer is required' })
  @ApiProperty()
  noCustomer: number;

  @IsNotEmpty({ message: 'Number bedroom is required' })
  @ApiProperty()
  noBedroom: number;

  @IsNotEmpty({ message: 'Number bed is required' })
  @ApiProperty()
  noBed: number;

  @IsNotEmpty({ message: 'Number bathroom is required' })
  @ApiProperty()
  noBathroom: number;

  @IsNotEmpty({ message: 'Price is required' })
  @ApiProperty()
  price: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isWashingMachine: boolean;

  @ApiProperty()
  isIron: boolean;

  @ApiProperty()
  isTelevision: boolean;

  @ApiProperty()
  isAirConditioner: boolean;

  @ApiProperty()
  isWifi: boolean;

  @ApiProperty()
  isKitchen: boolean;

  @ApiProperty()
  isParking: boolean;

  @ApiProperty()
  isPool: boolean;

  @ApiProperty()
  images: string[];
}

export class UpdateImageDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: any[];
}
