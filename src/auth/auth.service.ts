import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { hashSync, compareSync } from 'bcrypt';
import { ResponseAuthDto } from './dto/auth.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class AuthService {
  prisma = new PrismaClient();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  createAccessToken(uid: string): string {
    const token = this.jwtService.sign(
      {
        data: { uid },
      },
      {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        secret: this.configService.get('JWT_SECRET'),
      },
    );
    return token;
  }

  createRefreshToken(uid: string): string {
    const refreshToken = this.jwtService.sign(
      {
        data: { uid },
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      },
    );
    return refreshToken;
  }

  async register(body: RegisterDto): Promise<ResponseAuthDto> {
    try {
      const { name, email, password, phone, dob, gender, role } = body;
      const checkUser = await this.prisma.users.findFirst({
        where: { email },
      });
      if (checkUser) {
        throw new BadRequestException('User already exists');
      }

      const userNew = await this.prisma.users.create({
        data: {
          uid: uuidv4(),
          name,
          email,
          password: hashSync(password, 10),
          phone,
          dob: new Date(dob),
          gender,
          role,
        },
      });

      return plainToClass(ResponseAuthDto, userNew);
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(body: LoginDto): Promise<{
    user: ResponseAuthDto;
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const { email, password } = body;
      const checkUser = await this.prisma.users.findFirst({
        where: { email },
      });
      if (!checkUser) {
        throw new BadRequestException('User not found');
      }

      const isMatch = compareSync(password, checkUser.password);
      if (!isMatch) {
        throw new BadRequestException('Invalid password');
      }

      const accessToken = this.createAccessToken(checkUser.uid);
      const refreshToken = this.createRefreshToken(checkUser.uid);

      await this.prisma.users.update({
        where: { uid: checkUser.uid },
        data: {
          refresh_token: refreshToken,
        },
      });

      return {
        user: plainToClass(ResponseAuthDto, checkUser),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async extendToken(
    refreshToken: string,
  ): Promise<{ user: ResponseAuthDto; accessToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (_) {
      throw new UnauthorizedException('Invalid token');
    }

    const {
      data: { uid },
    } = this.jwtService.decode(refreshToken);

    const user = await this.prisma.users.findFirst({
      where: { uid },
    });
    const accessToken = this.createAccessToken(user.uid);

    return {
      user: plainToClass(ResponseAuthDto, user),
      accessToken,
    };
  }
}
