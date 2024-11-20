import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

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

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }
}
