import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  uid: string;

  @IsNotEmpty({ message: 'rid is required' })
  @ApiProperty()
  rid: string;

  @IsNotEmpty({ message: 'Checkin is required' })
  @ApiProperty()
  checkinAt: Date;

  @IsNotEmpty({ message: 'Checkout is required' })
  @ApiProperty()
  checkoutAt: Date;

  @IsNotEmpty({ message: 'Number customer is required' })
  @ApiProperty()
  noCustomer: number;
}
