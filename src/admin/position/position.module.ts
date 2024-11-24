import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { JwtMiddleware } from 'src/strategy/jwt.strategy';
import { AdminPermissionMiddleware } from 'src/permission/admin.permission';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [PositionController],
  providers: [PositionService],
})
export class AdminPositionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, AdminPermissionMiddleware)
      .forRoutes({ path: 'admin/position', method: RequestMethod.ALL });

    consumer
      .apply(JwtMiddleware, AdminPermissionMiddleware)
      .forRoutes({ path: 'admin/position/*', method: RequestMethod.ALL });
  }
}
