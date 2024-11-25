import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';

import { CreatePositionDto } from 'src/admin/position/dto/create-position.dto';
import { ResponsePositionDto } from 'src/admin/position/dto/response.dto';

@Injectable()
export class PositionService {
  prisma = new PrismaClient();

  async create(body: CreatePositionDto): Promise<ResponsePositionDto> {
    try {
      const { name, provice, country, images } = body;
      const newPosition = await this.prisma.positions.create({
        data: {
          pid: uuidv4(),
          name,
          provice,
          country,
          images: images ? JSON.stringify(images) : null,
        },
      });
      return plainToClass(ResponsePositionDto, newPosition);
    } catch (error) {
      throw new Error(error);
    }
  }

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

  async update(
    pid: string,
    body: CreatePositionDto,
  ): Promise<ResponsePositionDto> {
    try {
      const checkPosition = await this.prisma.positions.findUnique({
        where: { pid, status: 'active' },
      });
      if (!checkPosition) {
        throw new BadRequestException('Position not found');
      }

      const { name, provice, country, images } = body;
      const updatePosition = await this.prisma.positions.update({
        where: { pid },
        data: {
          name,
          provice,
          country,
          images: images ? JSON.stringify(images) : null,
        },
      });
      return plainToClass(ResponsePositionDto, updatePosition);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(pid: string) {
    try {
      const checkPosition = await this.prisma.positions.findUnique({
        where: { pid, status: 'active' },
      });
      if (!checkPosition) {
        throw new BadRequestException('Position not found');
      }

      await this.prisma.positions.update({
        where: { pid },
        data: { status: 'inactive' },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
