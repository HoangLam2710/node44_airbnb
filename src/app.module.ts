import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// admin
import { AdminAuthModule } from './admin/auth/auth.module';
import { AdminUserModule } from './admin/user/user.module';
import { AdminPositionModule } from './admin/position/position.module';
import { AdminRoomModule } from './admin/room/room.module';
// user
import { UserAuthModule } from './user/auth/auth.module';
import { UserModule } from './user/user/user.module';
import { UserPositionModule } from './user/position/position.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AdminAuthModule,
    AdminUserModule,
    AdminPositionModule,
    AdminRoomModule,
    UserAuthModule,
    UserModule,
    UserPositionModule,
  ],
})
export class AppModule {}
