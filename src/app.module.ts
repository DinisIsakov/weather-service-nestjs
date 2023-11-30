import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherModule } from './weather/weather.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    WeatherModule,
    AuthModule,
    HttpModule,
  ],
})
export class AppModule {}
