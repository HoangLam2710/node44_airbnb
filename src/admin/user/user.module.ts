import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtMiddleware } from 'src/strategy/jwt.strategy';
import { AdminPermissionMiddleware } from 'src/permission/admin.permission';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class AdminUserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, AdminPermissionMiddleware)
      .forRoutes({ path: 'admin/user', method: RequestMethod.ALL });

    consumer
      .apply(JwtMiddleware, AdminPermissionMiddleware)
      .forRoutes({ path: 'admin/user/*', method: RequestMethod.ALL });
  }
}
