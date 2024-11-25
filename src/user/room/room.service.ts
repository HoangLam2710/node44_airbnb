import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';

import { ResponseRoomDto } from 'src/admin/room/dto/response.dto';

@Injectable()
export class RoomService {
  prisma = new PrismaClient();

  async findAll(
    page: number,
    size: number,
    keyword: string,
  ): Promise<{ rooms: ResponseRoomDto[]; total: number }> {
    try {
      const rooms = await this.prisma.rooms.findMany({
        skip: (page - 1) * size,
        take: size,
        where: keyword
          ? { name: { contains: keyword }, status: 'active' }
          : { status: 'active' },
      });
      const countRoom = await this.prisma.rooms.count({
        where: keyword
          ? { name: { contains: keyword }, status: 'active' }
          : { status: 'active' },
      });
      const roomsResponse = rooms.map((user) =>
        plainToClass(ResponseRoomDto, user),
      );
      return {
        rooms: roomsResponse,
        total: countRoom,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findRoomByPid(pid: string): Promise<{ rooms: ResponseRoomDto[] }> {
    try {
      const checkPosition = await this.prisma.positions.findUnique({
        where: { pid, status: 'active' },
      });
      if (!checkPosition) {
        throw new BadRequestException('Position not found');
      }

      const rooms = await this.prisma.rooms.findMany({
        where: { pid, status: 'active' },
      });
      const roomsResponse = rooms.map((user) =>
        plainToClass(ResponseRoomDto, user),
      );
      return { rooms: roomsResponse };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(rid: string): Promise<ResponseRoomDto> {
    try {
      const checkRoom = await this.prisma.rooms.findUnique({
        where: { rid, status: 'active' },
      });
      if (!checkRoom) {
        throw new BadRequestException('Room not found');
      }

      return plainToClass(ResponseRoomDto, checkRoom);
    } catch (error) {
      throw new Error(error);
    }
  }
}
