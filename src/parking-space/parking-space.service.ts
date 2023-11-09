import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { Subject } from 'rxjs';

@Injectable()
export class ParkingSpaceService {
  private parkingSpaceCollection: Collection;

  constructor(private readonly configService: ConfigService) {}

  async initialize() {
    const client = new MongoClient(this.configService.get('MONGO_URL'));
    await client.connect();
    const db = client.db('match-service');
    this.parkingSpaceCollection = db.collection('parking-spaces');
    console.log('connected to parking space db');
  }

  async getParkingSpaces() {
    const dataFetchingResult = await this.parkingSpaceCollection
      .find()
      .toArray();

    const result = await Promise.all(
      dataFetchingResult.map(async (parkingSpace) => {
        const activeCount = await this.getActiveReservations(
          parkingSpace._id.toString(),
        );
        return {
          id: parkingSpace._id,
          lat: parkingSpace.lat,
          lng: parkingSpace.lng,
          name: parkingSpace.name,
          totalParking: parkingSpace.totalParking,
          available: parkingSpace.totalParking - activeCount,
        };
      }),
    );
    return result;
  }

  async getParkingSpaceById(id: string) {
    const findResult = await this.parkingSpaceCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!findResult)
      throw new NotFoundException('No parking space with that id');
    const activeCount = await this.getActiveReservations(
      findResult._id.toString(),
    );
    return {
      id: findResult._id,
      lat: findResult.lat,
      lng: findResult.lng,
      name: findResult.name,
      totalParking: findResult.totalParking,
      available: findResult.totalParking - activeCount,
    };
  }

  async createParkingSpace(
    lat: string,
    lng: string,
    name: string,
    totalParking: string,
  ) {
    await this.parkingSpaceCollection.insertOne({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name,
      totalParking: parseInt(totalParking),
    });
  }

  async updateParkingSpace(
    id: string,
    lat?: string,
    lng?: string,
    name?: string,
    totalParking?: string,
  ) {
    const updatePartial = {};
    if (lat) {
      updatePartial['lat'] = parseFloat(lat);
    }
    if (lng) {
      updatePartial['lng'] = parseFloat(lng);
    }
    if (name) {
      updatePartial['name'] = name;
    }
    if (totalParking) {
      updatePartial['totalParking'] = parseInt(totalParking);
    }
    const updateResult = await this.parkingSpaceCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: updatePartial,
      },
    );
    if (updateResult.matchedCount == 0)
      throw new NotFoundException('No parking space with that id');
  }

  async deleteParkingSpace(id: string) {
    const deleteResult = await this.parkingSpaceCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount == 0)
      throw new NotFoundException('No parking space with that id');
  }

  observeParkingSpaces() {
    const subject = new Subject();

    setInterval(
      async () => {
        const dataFetchingResult = await this.getParkingSpaces();
        subject.next({ parkingSpaceList: dataFetchingResult });
      },
      parseInt(this.configService.get('REFEASH_DELAY_MS')),
    );

    return subject.asObservable();
  }

  private async getActiveReservations(parkingLotId: string) {
    const getAvailableResult = await fetch(
      this.configService.get('RESERVATION_SERVICE_URL') +
        '/getActiveReservations/' +
        parkingLotId,
    );

    if (getAvailableResult.status != 200)
      throw new InternalServerErrorException();

    const responseBody = await new Response(getAvailableResult.body).json();
    return responseBody;
  }
}
