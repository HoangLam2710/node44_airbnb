import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { ResponseUserDto } from 'src/admin/user/dto/user.dto';

@Injectable()
export class UserService {
  prisma = new PrismaClient();

  async findAll(): Promise<ResponseUserDto[]> {
    try {
      const users = await this.prisma.users.findMany();
      const usersFilter = users.filter((user) => user.role === 3);
      return usersFilter.map((user) => plainToClass(ResponseUserDto, user));
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(uid: string) {
    try {
      const checkUser = await this.prisma.users.findUnique({
        where: { uid },
      });
      if (!checkUser) {
        throw new BadRequestException('User not found');
      }

      await this.prisma.users.delete({
        where: { uid },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
