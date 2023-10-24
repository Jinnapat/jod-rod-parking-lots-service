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

@Controller()
export class ParkingSpaceController {
  constructor(private readonly parkingSpacesService: ParkingSpaceService) {
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
}
