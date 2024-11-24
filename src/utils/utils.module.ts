import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
