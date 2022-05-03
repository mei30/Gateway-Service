import {
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderServiceClient,
  ORDER_SERVICE_NAME,
} from './order.pb';
import { Request } from 'express';

@Controller('order')
export class OrderController implements OnModuleInit {
  private orderService: OrderServiceClient;

  @Inject(ORDER_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.orderService =
      this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  private async createOrder(
    @Req() request: Request,
  ): Promise<Observable<CreateOrderResponse>> {
    const body: any = request['body'];

    const { productId, quantity } = body;

    const userId = <number>request['user'];

    const parameters: CreateOrderRequest = { productId, quantity, userId };

    return this.orderService.createOrder(parameters);
  }
}
