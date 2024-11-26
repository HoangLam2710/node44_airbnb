import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { JwtMiddleware } from 'src/strategy/jwt.strategy';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class UserReservationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: 'user/reservation', method: RequestMethod.ALL });

    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: 'user/reservation/*', method: RequestMethod.ALL });
  }
}
