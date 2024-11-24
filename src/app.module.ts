import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// admin
import { AdminAuthModule } from './admin/auth/auth.module';
import { AdminUserModule } from './admin/user/user.module';
import { AdminPositionModule } from './admin/position/position.module';
// user
import { UserAuthModule } from './user/auth/auth.module';
import { UserModule } from './user/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AdminAuthModule,
    AdminUserModule,
    AdminPositionModule,
    UserAuthModule,
    UserModule,
  ],
})
export class AppModule {}
