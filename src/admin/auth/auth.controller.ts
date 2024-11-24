import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RegisterDto } from 'src/admin/auth/dto/register.dto';
import { LoginDto } from 'src/admin/auth/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    try {
      const result = await this.authService.register(body);

      return res.status(HttpStatus.CREATED).json({
        message: 'Register successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/login')
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(body);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(HttpStatus.OK).json({
        message: 'Login successfully',
        data: { user: result.user, accessToken: result.accessToken },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/extend-token')
  async extendToken(@Req() req: Request, @Res() res: Response) {
    try {
      const uid = req.body.uid;

      const result = await this.authService.extendToken(uid);

      return res.status(HttpStatus.OK).json({
        message: 'Token extended',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
