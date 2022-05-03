import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { PRODUCT_PACKAGE_NAME, PRODUCT_SERVICE_NAME } from './product.pb';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_SERVICE_NAME,
      useFactory: (configService: ConfigService) => {
        const userServiceOptions: GrpcOptions = {
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('PRODUCT_SERVICE_URL'),
            package: PRODUCT_PACKAGE_NAME,
            protoPath: configService.get<string>('PRODUCT_SERVICE_PROTO_PATH'),
          },
        };
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class ProductModule {}
