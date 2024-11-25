import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { JwtMiddleware } from 'src/strategy/jwt.strategy';
import { AdminPermissionMiddleware } from 'src/permission/admin.permission';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class AdminRoomModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, AdminPermissionMiddleware)
      .forRoutes({ path: 'admin/room', method: RequestMethod.ALL });

    consumer
      .apply(JwtMiddleware, AdminPermissionMiddleware)
      .forRoutes({ path: 'admin/room/*', method: RequestMethod.ALL });
  }
}
