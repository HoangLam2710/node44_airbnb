import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  JwtMiddleware,
  JwtMiddlewareRefreshToken,
  JwtStrategy,
} from 'src/strategy/jwt.strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: 'admin/auth/register', method: RequestMethod.POST });

    consumer.apply(JwtMiddlewareRefreshToken).forRoutes({
      path: 'admin/auth/extend-token',
      method: RequestMethod.POST,
    });
  }
}
