import { INestApplication, MiddlewareConsumer, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { ExternalWeatherService } from './external-weather.service';
import { UserEntity } from './entities/user.entity';
import { ActionsEntity } from './entities/actions.entity';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity, ActionsEntity]),
    HttpModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService, ExternalWeatherService],
})
export class WeatherModule {
  constructor(private readonly weatherService: WeatherService) {}

  configure(consumer: MiddlewareConsumer): void {
    const jsonMiddleware = express.json();
    const urlencodedMiddleware = express.urlencoded({ extended: true });

    consumer
      .apply(jsonMiddleware, urlencodedMiddleware)
      .forRoutes(WeatherController);
  }

  static async setupSwagger(app: INestApplication): Promise<void> {
    const config = new DocumentBuilder()
      .setTitle('Weather Service API')
      .setDescription('API for obtaining current weather in cities')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
}
