import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
