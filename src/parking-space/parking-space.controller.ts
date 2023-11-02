import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { ParkingSpaceService } from './parking-space.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Subject } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Controller()
export class ParkingSpaceController {
  constructor(
    private readonly parkingSpacesService: ParkingSpaceService,
    private readonly configService: ConfigService,
  ) {
    this.parkingSpacesService.initialize();
  }

  @Get('getParkingSpaces')
  getParkingSpacesHandler() {
    return this.parkingSpacesService.getParkingSpaces();
  }

  @Get('getParkingSpace/:id')
  getParkingSpaceByIdHandler(@Param('id') id) {
    return this.parkingSpacesService.getParkingSpaceById(id);
  }

  @Post('createParkingSpace')
  createParkingSpaceHandler(
    @Body('lat') lat,
    @Body('lng') lng,
    @Body('name') name,
    @Body('totalParking') totalParking,
  ) {
    this.parkingSpacesService.createParkingSpace(lat, lng, name, totalParking);
  }

  @Patch('updateParkingSpace/:id')
  updateParkingSpaceHandler(
    @Param('id') id,
    @Body('lat') lat,
    @Body('lng') lng,
    @Body('name') name,
    @Body('totalParking') totalParking,
    @Body('available') available,
  ) {
    this.parkingSpacesService.updateParkingSpace(
      id,
      lat,
      lng,
      name,
      totalParking,
      available,
    );
  }

  @Delete('deleteParkingSpace/:id')
  deleteParkingSpaceHandler(@Param('id') id) {
    this.parkingSpacesService.deleteParkingSpace(id);
  }

  @GrpcMethod('GetAvailableSpacesService', 'getAvailableSpaces')
  getAvailableSpaces() {
    const subject = new Subject();

    setInterval(async () => {
      const result = await this.parkingSpacesService.getParkingSpaces();
      subject.next({ parkingSpaceList: result });
    }, this.configService.get('REFEASH_DELAY_MS'));

    const observable = subject.asObservable();
    return observable;
  }
}
