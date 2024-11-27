import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { JwtMiddleware } from 'src/strategy/jwt.strategy';
import { AdminPermissionMiddleware } from 'src/permission/admin.permission';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
})
export class AdminCommentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, AdminPermissionMiddleware)
      .forRoutes({ path: 'admin/comment', method: RequestMethod.ALL });

    consumer
      .apply(JwtMiddleware, AdminPermissionMiddleware)
      .forRoutes({ path: 'admin/comment/*', method: RequestMethod.ALL });
  }
}
