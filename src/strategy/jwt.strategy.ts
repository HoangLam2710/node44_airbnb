import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        this.configService.get('JWT_SECRET'),
      );
      req.body.uid = decoded['data']['uid'];
      next();
    } catch (err) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid token' });
    }
  }
}

@Injectable()
export class JwtMiddlewareRefreshToken implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers.cookie?.split('=')[1];

    if (!refreshToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        this.configService.get('JWT_REFRESH_SECRET'),
      );
      req.body.uid = decoded['data']['uid'];
      next();
    } catch (err) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid token' });
    }
  }
}
