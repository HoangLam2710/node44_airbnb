import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  createAccessToken(uid: string): string {
    const token = this.jwtService.sign(
      {
        data: { uid },
      },
      {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        secret: this.configService.get('JWT_SECRET'),
      },
    );
    return token;
  }

  createRefreshToken(uid: string): string {
    const refreshToken = this.jwtService.sign(
      {
        data: { uid },
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      },
    );
    return refreshToken;
  }
}
