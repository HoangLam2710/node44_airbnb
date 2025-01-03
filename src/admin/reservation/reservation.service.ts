import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ReservationService {
  prisma = new PrismaClient();

  async findAll(page: number, size: number) {
    try {
      const reservations = await this.prisma.reservation.findMany({
        skip: (page - 1) * size,
        take: size,
      });
      const countReservation = await this.prisma.reservation.count();
      return { reservations, total: countReservation };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(reid: string) {
    try {
      const checkReservation = await this.prisma.reservation.findUnique({
        where: { reid },
      });
      if (!checkReservation) {
        throw new BadRequestException('Reservation not found');
      }

      return checkReservation;
    } catch (error) {
      throw new Error(error);
    }
  }
}
