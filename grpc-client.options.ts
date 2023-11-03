import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:3001',
    package: 'parkingSpace',
    protoPath: join(__dirname, './parking-space/parking-space.proto'),
  },
};
