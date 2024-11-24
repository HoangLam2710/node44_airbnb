import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { CreatePositionDto } from 'src/admin/position/dto/create-position.dto';

@Injectable()
export class PositionService {
  prisma = new PrismaClient();

  async create(body: CreatePositionDto) {
    try {
      const { name, provice, country, images } = body;
      const positionNew = await this.prisma.positions.create({
        data: {
          pid: uuidv4(),
          name,
          provice,
          country,
          images: images ? JSON.stringify(images) : null,
        },
      });
      return positionNew;
    } catch (error) {
      throw new Error(error);
    }
  }
}
