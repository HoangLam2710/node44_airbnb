import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/token/token.module';
import { JwtMiddlewareRefreshToken } from 'src/strategy/jwt.strategy';

@Module({
  imports: [TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class UserAuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddlewareRefreshToken).forRoutes({
      path: 'user/auth/extend-token',
      method: RequestMethod.POST,
    });
  }
}
