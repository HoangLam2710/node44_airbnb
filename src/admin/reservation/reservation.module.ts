import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { JwtMiddleware } from 'src/strategy/jwt.strategy';
import { AdminPermissionMiddleware } from 'src/permission/admin.permission';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class AdminReservationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, AdminPermissionMiddleware)
      .forRoutes({ path: 'admin/reservation', method: RequestMethod.ALL });

    consumer
      .apply(JwtMiddleware, AdminPermissionMiddleware)
      .forRoutes({ path: 'admin/reservation/*', method: RequestMethod.ALL });
  }
}
