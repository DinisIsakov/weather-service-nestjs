import {
  Controller,
  Post,
  Body,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ExternalWeatherService } from './external-weather.service';
import { WeatherService } from './weather.service';
import { CurrentWeather } from './types';

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly externalWeatherService: ExternalWeatherService,
    private readonly weatherService: WeatherService,
  ) {}

  @Post('current')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Current weather data retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User or weather data not found' })
  async getCurrentWeather(@Body() weatherDto: CurrentWeather) {
    console.log('Received weather request:', weatherDto);

    if (!weatherDto.apiToken) {
      throw new NotFoundException('Missing apiToken');
    }

    try {
      const user = await this.weatherService.findUserByApiToken(
        weatherDto.apiToken,
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const weatherData = await this.weatherService.getCurrentWeather(
        weatherDto,
        user,
      );

      console.log('Received weather data:', weatherData);
      return weatherData;
    } catch (error) {
      console.error('Error in WeatherController:', error.message);

      return {
        message: 'Weather data not found',
        error: 'Not Found',
        statusCode: 404,
      };
    }
  }
}
