import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

// Class RmqService dùng để : 
//  + lắng nghe và nhận message từ các queue.
//  + được inject trực tiếp vào providers của app.service.ts
//  + được con triển khai trong main.ts
@Injectable()
export class RmqService {

  constructor(private readonly configService: ConfigService) { }

  getOptions(queue: string): RmqOptions {
    const USERNAME = this.configService.get<string>('RABBIT_USERNAME');
    const PASSWORD = this.configService.get<string>('RABBIT_PASSWORD');
    const HOST = this.configService.get<string>('RABBIT_HOST');
    const RABBIT_URL = `amqps://${USERNAME}:${PASSWORD}@${HOST}`;

    console.log('RabbitMQ is listening on queue: ', queue);

    return {
      transport: Transport.RMQ,
      options: {
        urls: [`${RABBIT_URL}`],
        queue: queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
