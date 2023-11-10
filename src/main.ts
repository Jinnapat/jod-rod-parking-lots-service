import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { grpcClientOptions } from 'grpc-client.options';
import { registerWithEureka } from './helper/eureka-helper'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(grpcClientOptions);
  registerWithEureka("PARKING-LOTS-SERVICE", 4000)
  await app.startAllMicroservices();
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
