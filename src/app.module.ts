import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParkingSpaceModule } from './parking-space/parking-space.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from 'grpc-client.options';

@Module({
  imports: [
    ParkingSpaceModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'GET_AVAILABLE_SPACES_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
