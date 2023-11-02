import { Observable } from 'rxjs';

export interface GetAvailableSpacesService {
  getAvailableSpaces(): Observable<ParkingSpaceList>;
}

export interface ParkingSpace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  available: number;
}

export interface ParkingSpaceList {
  parkingSpaceList: ParkingSpace[];
}
