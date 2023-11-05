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

@Controller()
export class ParkingSpaceController {
  constructor(private readonly parkingSpacesService: ParkingSpaceService) {
    this.parkingSpacesService.initialize();
  }

  @Get('getParkingSpaces')
  async getParkingSpacesHandler() {
    return await this.parkingSpacesService.getParkingSpaces();
  }

  @Get('getParkingSpace/:id')
  async getParkingSpaceByIdHandler(@Param('id') id) {
    return await this.parkingSpacesService.getParkingSpaceById(id);
  }

  @Post('createParkingSpace')
  async createParkingSpaceHandler(
    @Body('lat') lat,
    @Body('lng') lng,
    @Body('name') name,
    @Body('totalParking') totalParking,
  ) {
    return await this.parkingSpacesService.createParkingSpace(
      lat,
      lng,
      name,
      totalParking,
    );
  }

  @Patch('updateParkingSpace/:id')
  async updateParkingSpaceHandler(
    @Param('id') id,
    @Body('lat') lat,
    @Body('lng') lng,
    @Body('name') name,
    @Body('totalParking') totalParking,
  ) {
    return await this.parkingSpacesService.updateParkingSpace(
      id,
      lat,
      lng,
      name,
      totalParking,
    );
  }

  @Delete('deleteParkingSpace/:id')
  async deleteParkingSpaceHandler(@Param('id') id) {
    return await this.parkingSpacesService.deleteParkingSpace(id);
  }

  @GrpcMethod('GetAvailableSpacesService', 'getAvailableSpaces')
  getAvailableSpaces() {
    return this.parkingSpacesService.observeParkingSpaces();
  }
}
