import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { CreateCommentDto } from 'src/user/comment/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/user/comment/dto/update-comment.dto';

@Injectable()
export class CommentService {
  prisma = new PrismaClient();

  async create(body: CreateCommentDto) {
    try {
      const { uid, rid, content, rate } = body;

      const checkRoom = await this.prisma.rooms.findUnique({
        where: { rid, status: 'active' },
      });
      if (!checkRoom) {
        throw new BadRequestException('Room not found');
      }

      const newComment = await this.prisma.comments.create({
        data: {
          cid: uuidv4(),
          uid,
          rid,
          content,
          rate,
          create_at: new Date(),
        },
      });
      return newComment;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAllByRoom(rid: string, page: number, size: number) {
    try {
      const comments = await this.prisma.comments.findMany({
        where: { rid },
        skip: (page - 1) * size,
        take: size,
      });
      const countComment = await this.prisma.comments.count({
        where: { rid },
      });
      return { comments, total: countComment };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(cid: string, body: UpdateCommentDto) {
    try {
      const { uid, content, rate } = body;

      const checkComment = await this.prisma.comments.findUnique({
        where: { cid, uid },
      });
      if (!checkComment) {
        throw new BadRequestException('Comment not found');
      }

      const updateComment = await this.prisma.comments.update({
        where: { cid },
        data: {
          content,
          rate,
        },
      });
      return updateComment;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(cid: string, uid: string) {
    try {
      const checkComment = await this.prisma.comments.findUnique({
        where: { cid, uid },
      });
      if (!checkComment) {
        throw new BadRequestException('Comment not found');
      }

      await this.prisma.comments.delete({
        where: { cid },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
