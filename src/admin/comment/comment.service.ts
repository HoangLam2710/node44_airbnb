import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentService {
  prisma = new PrismaClient();

  async findAll(page: number, size: number) {
    try {
      const comments = await this.prisma.comments.findMany({
        skip: (page - 1) * size,
        take: size,
      });
      const countComment = await this.prisma.comments.count();
      return { comments, total: countComment };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(cid: string) {
    try {
      const checkComment = await this.prisma.comments.findUnique({
        where: { cid },
      });
      if (!checkComment) {
        throw new BadRequestException('Comment not found');
      }

      return checkComment;
    } catch (error) {
      throw new Error(error);
    }
  }
}
