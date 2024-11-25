import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { hashSync, compareSync } from 'bcrypt';
import { ResponseAuthDto } from './dto/auth.dto';
import { RegisterDto } from 'src/admin/auth/dto/register.dto';
import { LoginDto } from 'src/admin/auth/dto/login.dto';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  prisma = new PrismaClient();

  constructor(private tokenService: TokenService) {}

  async register(body: RegisterDto): Promise<ResponseAuthDto> {
    try {
      const { name, email, password, phone, dob, gender } = body;

      const checkUser = await this.prisma.users.findFirst({
        where: { email },
      });
      if (checkUser) {
        throw new BadRequestException('User already exists');
      }

      const newUser = await this.prisma.users.create({
        data: {
          uid: uuidv4(),
          name,
          email,
          password: hashSync(password, 10),
          phone,
          dob: new Date(dob),
          gender,
          role: 2,
        },
      });

      return plainToClass(ResponseAuthDto, newUser);
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
      if (checkUser.role === 3) {
        throw new BadRequestException('Do not have permission');
      }

      const isMatch = compareSync(password, checkUser.password);
      if (!isMatch) {
        throw new BadRequestException('Invalid password');
      }

      const accessToken = this.tokenService.createAccessToken(checkUser.uid);
      const refreshToken = this.tokenService.createRefreshToken(checkUser.uid);

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
    uid: string,
  ): Promise<{ user: ResponseAuthDto; accessToken: string }> {
    const user = await this.prisma.users.findUnique({
      where: { uid },
    });
    const accessToken = this.tokenService.createAccessToken(user.uid);

    return {
      user: plainToClass(ResponseAuthDto, user),
      accessToken,
    };
  }
}
