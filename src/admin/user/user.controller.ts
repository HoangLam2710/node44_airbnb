import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Admin User')
@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get('/')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all videos successfully',
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

      const result = await this.userService.findAll(
        formatPage,
        formatSize,
        keyword,
      );

      return res.status(HttpStatus.OK).json({
        message: 'Get all users successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Delete('/:uid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remove user successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async remove(@Param('uid') uid: string, @Res() res: Response) {
    try {
      await this.userService.remove(uid);

      return res.status(HttpStatus.OK).json({
        message: 'Remove user successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
