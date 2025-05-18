import { DynamicModule, Module } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

interface RmqModuleOptions {
  queueName: string;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})

// Thằng này dùng để  push message lên QUEUE

export class RmqModule {
  static register({ queueName }: RmqModuleOptions): DynamicModule {
    
    console.log("queueName ", queueName);

    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: queueName,
            useFactory: (configService: ConfigService) => {

              const USERNAME = configService.get<string>('RABBIT_USERNAME');
              const PASSWORD = configService.get<string>('RABBIT_PASSWORD');
              const HOST = configService.get<string>('RABBIT_HOST');
              const RABBIT_URL = `amqps://${USERNAME}:${PASSWORD}@${HOST}`;

              console.log('RABBIT_URL ', RABBIT_URL);
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [`amqps://iyksiimp:DeUCNk-jKZpW-NFtdn0iUNbHG4o9Wa6d@armadillo.rmq.cloudamqp.com/iyksiimp`],
                  queue: queueName,
                },
              }
            },
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
