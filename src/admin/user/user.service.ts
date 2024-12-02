import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { ResponseUserDto } from 'src/admin/user/dto/user.dto';

@Injectable()
export class UserService {
  prisma = new PrismaClient();

  async findAll(
    page: number,
    size: number,
    keyword: string,
  ): Promise<{ users: ResponseUserDto[]; total: number }> {
    try {
      const users = await this.prisma.users.findMany({
        skip: (page - 1) * size,
        take: size,
        where: keyword ? { name: { contains: keyword }, role: 3 } : { role: 3 },
      });
      const countUser = await this.prisma.users.count({
        where: keyword ? { name: { contains: keyword }, role: 3 } : { role: 3 },
      });
      const usersResponse = users.map((user) =>
        plainToClass(ResponseUserDto, user),
      );
      return { users: usersResponse, total: countUser };
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

      if (checkUser.role !== 3) {
        throw new BadRequestException('User is not a customer');
      }

      await this.prisma.users.delete({
        where: { uid },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
