import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { JwtMiddleware } from 'src/strategy/jwt.strategy';

@Module({
  controllers: [PositionController],
  providers: [PositionService],
})
export class UserPositionModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: 'user/position', method: RequestMethod.ALL });

    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: 'user/position/*', method: RequestMethod.ALL });
  }
}
