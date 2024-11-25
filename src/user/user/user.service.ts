import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from 'src/user/user/dto/update-user.dto';
import { ResponseUserDto } from 'src/user/user/dto/user.dto';

@Injectable()
export class UserService {
  prisma = new PrismaClient();

  async findOne(uid: string): Promise<ResponseUserDto> {
    try {
      const checkUser = await this.prisma.users.findUnique({
        where: { uid },
      });
      if (!checkUser) {
        throw new BadRequestException('User not found');
      }

      return plainToClass(ResponseUserDto, checkUser);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(uid: string, body: UpdateUserDto): Promise<ResponseUserDto> {
    try {
      const checkUser = await this.prisma.users.findUnique({
        where: { uid },
      });
      if (!checkUser) {
        throw new BadRequestException('User not found');
      }

      const { name, phone, dob, gender } = body;
      const newUser = await this.prisma.users.update({
        where: { uid },
        data: {
          name,
          phone,
          dob,
          gender,
        },
      });

      return plainToClass(ResponseUserDto, newUser);
    } catch (error) {
      throw new Error(error);
    }
  }
}
