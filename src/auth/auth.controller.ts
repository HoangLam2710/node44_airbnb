import { Controller, Post, Body, Res, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { LoginDto } from 'src/auth/dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
      const refreshToken = req.headers.cookie.split('=')[1];

      const result = await this.authService.extendToken(refreshToken);

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
