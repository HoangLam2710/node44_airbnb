import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Admin User')
@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get('/')
  async findAll(@Res() res: Response) {
    try {
      const users = await this.userService.findAll();

      return res.status(HttpStatus.OK).json({
        message: 'Get all users successfully',
        data: users,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Delete('/:uid')
  async remove(@Param('uid') uid: string, @Res() res: Response) {
    try {
      await this.userService.remove(uid);

      return res.status(HttpStatus.OK).json({
        message: 'Remove successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
