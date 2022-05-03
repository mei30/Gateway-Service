import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { OrderController } from './order.controller';
import { ORDER_PACKAGE_NAME, ORDER_SERVICE_NAME } from './order.pb';

@Module({
  imports: [AuthModule],
  controllers: [OrderController],
  providers: [
    {
      provide: ORDER_SERVICE_NAME,
      useFactory: (configService: ConfigService) => {
        const userServiceOptions: GrpcOptions = {
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('ORDER_SERVICE_URL'),
            package: ORDER_PACKAGE_NAME,
            protoPath: configService.get<string>('ORDER_SERVICE_PROTO_PATH'),
          },
        };
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class OrderModule {}
