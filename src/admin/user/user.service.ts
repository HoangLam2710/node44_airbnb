import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService {
  prisma = new PrismaClient();

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
