import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { hashSync } from 'bcrypt';
import { RegisterDto, ResponseRegisterDto } from './dto/register.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  prisma = new PrismaClient();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(body: RegisterDto): Promise<ResponseRegisterDto> {
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

      return plainToClass(ResponseRegisterDto, userNew);
    } catch (error) {
      throw new Error(error);
    }
  }

  // async login(body: RegisterDto) {
  //   try {
  //     const { email, pass_word } = body;
  //     const checkUser = await this.prisma.users.findFirst({
  //       where: { email },
  //     });
  //     if (!checkUser) {
  //       throw new BadRequestException('User not found');
  //     }

  //     const isMatch = checkUser.pass_word === pass_word;
  //     if (!isMatch) {
  //       throw new BadRequestException('Invalid password');
  //     }

  //     const token = this.jwtService.sign(
  //       {
  //         data: { userId: checkUser.user_id },
  //       },
  //       {
  //         expiresIn: '30m',
  //         secret: this.configService.get('SECRET_KEY'),
  //         algorithm: 'RS256',
  //       },
  //     );

  //     return token;
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }
}
