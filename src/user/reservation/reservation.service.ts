import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { CreateReservationDto } from 'src/user/reservation/dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  prisma = new PrismaClient();

  async create(body: CreateReservationDto) {
    try {
      const { uid, rid, checkinAt, checkoutAt, noCustomer } = body;

      const checkRoom = await this.prisma.rooms.findUnique({
        where: { rid, status: 'active' },
      });
      if (!checkRoom) {
        throw new BadRequestException('Room not found');
      }

      if (checkinAt > checkoutAt) {
        throw new BadRequestException(
          'Checkin date must be less than checkout date',
        );
      }

      if (checkinAt < new Date()) {
        throw new BadRequestException(
          'Checkin date must be greater than current date',
        );
      }

      if (checkoutAt < new Date()) {
        throw new BadRequestException(
          'Checkout date must be greater than current date',
        );
      }

      if (checkinAt === checkoutAt) {
        throw new BadRequestException(
          'Checkin date must be different from checkout date',
        );
      }

      if (noCustomer < 1) {
        throw new BadRequestException(
          'Number of customer must be greater than 0',
        );
      }

      const newReservation = await this.prisma.reservation.create({
        data: {
          reid: uuidv4(),
          uid,
          rid,
          no_customer: noCustomer,
          checkin_at: new Date(checkinAt.toString().split('T')[0]),
          checkout_at: new Date(checkoutAt.toString().split('T')[0]),
        },
      });
      return newReservation;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(uid: string) {
    try {
      const reservations = await this.prisma.reservation.findMany({
        where: { uid },
      });
      return reservations;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(reid: string, uid: string) {
    try {
      const checkReservation = await this.prisma.reservation.findUnique({
        where: { reid, uid },
      });
      if (!checkReservation) {
        throw new BadRequestException('Reservation not found');
      }

      return checkReservation;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(reid: string, body: CreateReservationDto) {
    try {
      const { uid, rid, checkinAt, checkoutAt, noCustomer } = body;

      const checkReservation = await this.prisma.reservation.findUnique({
        where: { reid, uid },
      });
      if (!checkReservation) {
        throw new BadRequestException('Reservation not found');
      }

      const checkRoom = await this.prisma.rooms.findUnique({
        where: { rid, status: 'active' },
      });
      if (!checkRoom) {
        throw new BadRequestException('Room not found');
      }

      if (checkinAt > checkoutAt) {
        throw new BadRequestException(
          'Checkin date must be less than checkout date',
        );
      }

      if (checkinAt < new Date()) {
        throw new BadRequestException(
          'Checkin date must be greater than current date',
        );
      }

      if (checkoutAt < new Date()) {
        throw new BadRequestException(
          'Checkout date must be greater than current date',
        );
      }

      if (checkinAt === checkoutAt) {
        throw new BadRequestException(
          'Checkin date must be different from checkout date',
        );
      }

      if (noCustomer < 1) {
        throw new BadRequestException(
          'Number of customer must be greater than 0',
        );
      }

      const updateReservation = await this.prisma.reservation.update({
        where: { reid },
        data: {
          rid,
          no_customer: noCustomer,
          checkin_at: new Date(checkinAt.toString().split('T')[0]),
          checkout_at: new Date(checkoutAt.toString().split('T')[0]),
        },
      });
      return updateReservation;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(reid: string, uid: string) {
    try {
      const checkReservation = await this.prisma.reservation.findUnique({
        where: { reid, uid },
      });
      if (!checkReservation) {
        throw new BadRequestException('Reservation not found');
      }

      await this.prisma.reservation.delete({
        where: { reid },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
