import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SuperAdminPermissionMiddleware implements NestMiddleware {
  prisma = new PrismaClient();

  async use(req: Request, res: Response, next: NextFunction) {
    const { uid } = req.body;

    const checkAdmin = await this.prisma.users.findUnique({
      where: { uid },
    });
    if (checkAdmin && checkAdmin.role !== 1) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Do not have permission' });
    }
    next();
  }
}
