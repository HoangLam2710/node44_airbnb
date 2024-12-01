import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Admin Reservation')
@Controller('admin/reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiBearerAuth()
  @Get('/')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all reservation successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Res() res: Response,
  ) {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = size ? Number(size) : 10;

      const reservations = await this.reservationService.findAll(
        formatPage,
        formatSize,
      );

      return res.status(HttpStatus.OK).json({
        message: 'Get all reservation successfully',
        data: { ...reservations },
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
