import { Body, Inject, OnModuleInit, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  RegisterResponse,
  AuthServiceClient,
  AUTH_SERVICE_NAME,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
} from './auth.pb';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthServiceClient;
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly sss: AuthService,
  ) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('/register')
  async register(
    @Body() body: RegisterRequest,
  ): Promise<Observable<RegisterResponse>> {
    const response = await this.authService.register(body);
    return response;
  }

  @Post('/login')
  async login(@Body() body: LoginRequest): Promise<Observable<LoginResponse>> {
    const response = await this.authService.login(body);
    return response;
  }
}
