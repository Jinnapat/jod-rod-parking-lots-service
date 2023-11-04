import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.parkingSpaceCollection.find().toArray();
  }

  async getParkingSpaceById(id: string) {
    const findResult = await this.parkingSpaceCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!findResult)
      throw new NotFoundException('No parking space with that id');
    return findResult;
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
      available: 0,
    });
  }

  async updateParkingSpace(
    id: string,
    lat?: string,
    lng?: string,
    name?: string,
    totalParking?: string,
    available?: string,
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
    if (available) {
      updatePartial['available'] = parseInt(available);
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

    setInterval(async () => {
      const dataFetchingResult = await this.getParkingSpaces();
      const result = dataFetchingResult.map((parkingSpace) => ({
        id: parkingSpace._id,
        ...parkingSpace,
      }));
      subject.next({ parkingSpaceList: result });
    }, this.configService.get('REFEASH_DELAY_MS'));

    return subject.asObservable();
  }
}
