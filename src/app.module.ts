import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParkingSpaceModule } from './parking-space/parking-space.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ParkingSpaceModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
