import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { compareSync, hashSync } from 'bcrypt';
import { ResponseAuthDto } from 'src/user/auth/dto/auth.dto';
import { RegisterDto } from 'src/user/auth/dto/register.dto';
import { LoginDto } from 'src/user/auth/dto/login.dto';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class AuthService {
  prisma = new PrismaClient();

  constructor(private utilsService: UtilsService) {}

  async register(body: RegisterDto): Promise<ResponseAuthDto> {
    try {
      const { name, email, password, phone, dob, gender } = body;

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
          role: 3,
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

      const accessToken = this.utilsService.createAccessToken(checkUser.uid);
      const refreshToken = this.utilsService.createRefreshToken(checkUser.uid);

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
    const accessToken = this.utilsService.createAccessToken(user.uid);

    return {
      user: plainToClass(ResponseAuthDto, user),
      accessToken,
    };
  }
}