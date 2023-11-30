import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WeatherModule } from './weather/weather.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(new Logger('App'));

  await Promise.all([WeatherModule.setupSwagger(app), app.listen(3000)]);
}

bootstrap();
