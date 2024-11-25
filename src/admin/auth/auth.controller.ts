import { Controller, Post, Body, Res, HttpStatus, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RegisterDto } from 'src/admin/auth/dto/register.dto';
import { LoginDto } from 'src/admin/auth/dto/login.dto';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @Post('/register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Register successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(body);

      return res.status(HttpStatus.CREATED).json({
        message: 'Register successfully',
        data: { user },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Post('/login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token extended',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
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
