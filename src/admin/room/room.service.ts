import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';

import { CreateRoomDto } from 'src/admin/room/dto/create-room.dto';
import { ResponseRoomDto } from 'src/admin/room/dto/response.dto';

@Injectable()
export class RoomService {
  prisma = new PrismaClient();

  async create(body: CreateRoomDto): Promise<ResponseRoomDto> {
    try {
      const {
        pid,
        name,
        noCustomer,
        noBedroom,
        noBed,
        noBathroom,
        price,
        description,
        isWashingMachine,
        isIron,
        isTelevision,
        isAirConditioner,
        isWifi,
        isKitchen,
        isParking,
        isPool,
        images,
      } = body;

      const checkPosition = await this.prisma.positions.findUnique({
        where: { pid, status: 'active' },
      });
      if (!checkPosition) {
        throw new BadRequestException('Position not found');
      }

      const newRoom = await this.prisma.rooms.create({
        data: {
          rid: uuidv4(),
          pid,
          name,
          no_customer: noCustomer,
          no_bedroom: noBedroom,
          no_bed: noBed,
          no_bathroom: noBathroom,
          price,
          description,
          is_washing_machine: isWashingMachine,
          is_iron: isIron,
          is_television: isTelevision,
          is_air_conditioner: isAirConditioner,
          is_wifi: isWifi,
          is_kitchen: isKitchen,
          is_parking: isParking,
          is_pool: isPool,
          images: images ? JSON.stringify(images) : null,
        },
      });
      return plainToClass(ResponseRoomDto, newRoom);
    } catch (error) {
      throw new Error(error);
    }
  }

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

  async update(rid: string, body: CreateRoomDto): Promise<ResponseRoomDto> {
    try {
      const checkRoom = await this.prisma.rooms.findUnique({
        where: { rid, status: 'active' },
      });
      if (!checkRoom) {
        throw new BadRequestException('Room not found');
      }

      const {
        pid,
        name,
        noCustomer,
        noBedroom,
        noBed,
        noBathroom,
        price,
        description,
        isWashingMachine,
        isIron,
        isTelevision,
        isAirConditioner,
        isWifi,
        isKitchen,
        isParking,
        isPool,
        images,
      } = body;
      const updateRoom = await this.prisma.rooms.update({
        where: { rid },
        data: {
          pid,
          name,
          no_customer: noCustomer,
          no_bedroom: noBedroom,
          no_bed: noBed,
          no_bathroom: noBathroom,
          price,
          description,
          is_washing_machine: isWashingMachine,
          is_iron: isIron,
          is_television: isTelevision,
          is_air_conditioner: isAirConditioner,
          is_wifi: isWifi,
          is_kitchen: isKitchen,
          is_parking: isParking,
          is_pool: isPool,
          images: images ? JSON.stringify(images) : null,
        },
      });
      return plainToClass(ResponseRoomDto, updateRoom);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(rid: string) {
    try {
      const checkRoom = await this.prisma.rooms.findUnique({
        where: { rid, status: 'active' },
      });
      if (!checkRoom) {
        throw new BadRequestException('Room not found');
      }

      await this.prisma.rooms.update({
        where: { rid },
        data: { status: 'inactive' },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
