import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WeatherModule } from './weather/weather.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(new Logger('App'));

  const config = new DocumentBuilder()
    .setTitle('Weather Service')
    .setDescription('API Documentation for Weather Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await Promise.all([WeatherModule.setupSwagger(app), app.listen(3000)]);
}

bootstrap();
