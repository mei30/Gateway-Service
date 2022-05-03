import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from './auth.pb';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { AuthGuard } from './guards/auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE_NAME,
      useFactory: (configService: ConfigService) => {
        const userServiceOptions: GrpcOptions = {
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('AUTH_SERVICE_URL'),
            package: AUTH_PACKAGE_NAME,
            protoPath: configService.get<string>('AUTH_SERVICE_PROTO_PATH'),
          },
        };
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    AuthGuard,
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
