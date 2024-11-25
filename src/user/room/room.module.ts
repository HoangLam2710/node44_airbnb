import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { JwtMiddleware } from 'src/strategy/jwt.strategy';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
})
export class UserRoomModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: 'user/room', method: RequestMethod.ALL });

    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: 'user/room/*', method: RequestMethod.ALL });
  }
}
