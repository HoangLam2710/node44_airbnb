import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { PositionService } from './position.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('User Position')
@Controller('user/position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @ApiBearerAuth()
  @Get('/')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all position successfully',
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

      const result = await this.positionService.findAll(
        formatPage,
        formatSize,
        keyword,
      );

      return res.status(HttpStatus.OK).json({
        message: 'Get all position successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Get('/:pid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get position detail successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findOne(@Param('pid') pid: string, @Res() res: Response) {
    try {
      const position = await this.positionService.findOne(pid);

      return res.status(HttpStatus.OK).json({
        message: 'Get position detail successfully',
        data: { position },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
