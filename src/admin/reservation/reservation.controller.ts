import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Admin Reservation')
@Controller('admin/reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiBearerAuth()
  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all reservation successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll(@Res() res: Response) {
    try {
      const reservations = await this.reservationService.findAll();

      return res.status(HttpStatus.OK).json({
        message: 'Get all reservation successfully',
        data: { reservations },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Get('/:reid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get reservation detail successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findOne(@Param('reid') reid: string, @Res() res: Response) {
    try {
      const reservation = await this.reservationService.findOne(reid);

      return res.status(HttpStatus.OK).json({
        message: 'Get reservation detail successfully',
        data: { reservation },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
