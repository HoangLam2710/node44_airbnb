import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';

import { ResponsePositionDto } from 'src/admin/position/dto/response.dto';

@Injectable()
export class PositionService {
  prisma = new PrismaClient();

  async findAll(
    page: number,
    size: number,
    keyword: string,
  ): Promise<{ positions: ResponsePositionDto[]; total: number }> {
    try {
      const positions = await this.prisma.positions.findMany({
        skip: (page - 1) * size,
        take: size,
        where: keyword
          ? { name: { contains: keyword }, status: 'active' }
          : { status: 'active' },
      });
      const countPosition = await this.prisma.positions.count({
        where: keyword
          ? { name: { contains: keyword }, status: 'active' }
          : { status: 'active' },
      });
      const positionsResponse = positions.map((user) =>
        plainToClass(ResponsePositionDto, user),
      );
      return {
        positions: positionsResponse,
        total: countPosition,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(pid: string): Promise<ResponsePositionDto> {
    try {
      const checkPosition = await this.prisma.positions.findUnique({
        where: { pid, status: 'active' },
      });
      if (!checkPosition) {
        throw new BadRequestException('Position not found');
      }

      return plainToClass(ResponsePositionDto, checkPosition);
    } catch (error) {
      throw new Error(error);
    }
  }
}
