import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreElements: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  prisma = new PrismaClient();

  async validate(tokenDecode: any) {
    const userId = tokenDecode.data.userId;
    const checkUser = await this.prisma.users.findFirst({
      where: { uid: userId },
    });

    if (!checkUser) {
      return false;
    }
    return tokenDecode;
  }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const accessTokentoken = req.headers.authorization?.split(' ')[1];
    if (!accessTokentoken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(
        accessTokentoken,
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
