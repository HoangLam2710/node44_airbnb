import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/token/token.module';
import {
  JwtMiddleware,
  JwtMiddlewareRefreshToken,
} from 'src/strategy/jwt.strategy';
import { SuperAdminPermissionMiddleware } from 'src/permission/super-admin.permission';
import { EmailModule } from 'src/email/email.module';
import { AdminPermissionMiddleware } from 'src/permission/admin.permission';

@Module({
  imports: [TokenModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AdminAuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, SuperAdminPermissionMiddleware)
      .forRoutes({ path: 'admin/auth/register', method: RequestMethod.POST });

    consumer.apply(JwtMiddlewareRefreshToken).forRoutes({
      path: 'admin/auth/extend-token',
      method: RequestMethod.POST,
    });
  }
}
