import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateReservationDto } from 'src/user/reservation/dto/create-reservation.dto';

@ApiTags('User Reservation')
@Controller('user/reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiBearerAuth()
  @Post('/')
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a room reservation successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() body: CreateReservationDto, @Res() res: Response) {
    try {
      const reservation = await this.reservationService.create(body);

      return res.status(HttpStatus.CREATED).json({
        message: 'Create a room reservation successfully',
        data: { reservation },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

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
  async findAll(@Body() body, @Res() res: Response) {
    try {
      const reservations = await this.reservationService.findAll(body.uid);
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
  async findOne(
    @Param('reid') reid: string,
    @Body() body,
    @Res() res: Response,
  ) {
    try {
      const reservation = await this.reservationService.findOne(reid, body.uid);

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

  @ApiBearerAuth()
  @Put('/:reid')
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update a room reservation successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async update(
    @Param('reid') reid: string,
    @Body() body: CreateReservationDto,
    @Res() res: Response,
  ) {
    try {
      const reservation = await this.reservationService.update(reid, body);

      return res.status(HttpStatus.OK).json({
        message: 'Update a room reservation successfully',
        data: { reservation },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Delete('/:reid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remove reservation successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async remove(
    @Param('reid') reid: string,
    @Body() body,
    @Res() res: Response,
  ) {
    try {
      await this.reservationService.remove(reid, body.uid);

      return res.status(HttpStatus.OK).json({
        message: 'Remove reservation successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
