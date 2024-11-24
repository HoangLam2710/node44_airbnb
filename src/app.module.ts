import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AdminAuthModule } from './admin/auth/auth.module';
import { AdminUserModule } from './admin/user/user.module';
import { UserAuthModule } from './user/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AdminAuthModule,
    AdminUserModule,
    UserAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
