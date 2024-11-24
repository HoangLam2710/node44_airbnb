import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  JwtMiddleware,
  JwtMiddlewareRefreshToken,
} from 'src/strategy/jwt.strategy';
import { UtilsModule } from 'src/utils/utils.module';
import { SuperAdminPermissionMiddleware } from 'src/permission/super-admin.permission';

@Module({
  imports: [UtilsModule],
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
