import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// admin
import { AdminAuthModule } from './admin/auth/auth.module';
import { AdminUserModule } from './admin/user/user.module';
import { AdminPositionModule } from './admin/position/position.module';
import { AdminRoomModule } from './admin/room/room.module';
import { AdminReservationModule } from './admin/reservation/reservation.module';
// user
import { UserAuthModule } from './user/auth/auth.module';
import { UserModule } from './user/user/user.module';
import { UserPositionModule } from './user/position/position.module';
import { UserRoomModule } from './user/room/room.module';
import { UserReservationModule } from './user/reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AdminAuthModule,
    AdminUserModule,
    AdminPositionModule,
    AdminRoomModule,
    AdminReservationModule,
    UserAuthModule,
    UserModule,
    UserPositionModule,
    UserRoomModule,
    UserReservationModule,
  ],
})
export class AppModule {}
