import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentService {
  prisma = new PrismaClient();

  async findAll() {
    try {
      const comments = await this.prisma.comments.findMany();
      return comments;
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
