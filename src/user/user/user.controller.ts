import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/user/user/dto/update-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user detail successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findOne(@Req() req: Request, @Res() res: Response) {
    try {
      const uid = req.body.uid;
      const user = await this.userService.findOne(uid);

      return res.status(HttpStatus.OK).json({
        message: 'Get user detail successfully',
        data: { user },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @ApiBearerAuth()
  @Put('/')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update user successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async update(
    @Body() body: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const uid = req.body.uid;
      const user = await this.userService.update(uid, body);

      return res.status(HttpStatus.OK).json({
        message: 'Update user successfully',
        data: { user },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
