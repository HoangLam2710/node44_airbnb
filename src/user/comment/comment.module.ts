import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { JwtMiddleware } from 'src/strategy/jwt.strategy';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
})
export class UserCommentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: 'user/comment', method: RequestMethod.ALL });

    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: 'user/comment/*', method: RequestMethod.ALL });
  }
}
