import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('User Room')
@Controller('user/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiBearerAuth()
  @Get('/')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all room successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('keyword') keyword: string,
    @Res() res: Response,
  ) {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = size ? Number(size) : 10;

      const result = await this.roomService.findAll(
        formatPage,
        formatSize,
        keyword,
      );

      return res.status(HttpStatus.OK).json({
        message: 'Get all room successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Get('/find-room-by-position/:pid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get room by position successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findRoomByPid(@Param('pid') pid: string, @Res() res: Response) {
    try {
      const result = await this.roomService.findRoomByPid(pid);

      return res.status(HttpStatus.OK).json({
        message: 'Get room by position successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Get('/:rid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get room detail successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findOne(@Param('rid') rid: string, @Res() res: Response) {
    try {
      const room = await this.roomService.findOne(rid);

      return res.status(HttpStatus.OK).json({
        message: 'Get room detail successfully',
        data: { room },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
