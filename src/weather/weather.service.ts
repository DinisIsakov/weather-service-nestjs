import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { WeatherDto } from './dto/weather.dto';
import { ExternalWeatherService } from './external-weather.service';
import { ActionsEntity } from './entities/actions.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ActionsEntity)
    private readonly actionsRepository: Repository<ActionsEntity>,
    private readonly externalWeatherService: ExternalWeatherService,
  ) {}

  async getCurrentWeather(
    weatherDto: WeatherDto,
    user: UserEntity,
  ): Promise<{ temperature: number; description: string }> {
    const { city, language } = weatherDto;

    try {
      const weatherResponse = await firstValueFrom(
        this.externalWeatherService.getWeather(city, language),
      );

      const actionTime = Math.floor(Date.now() / 1000);
      const requestResult = weatherResponse.temp_c ? '200' : '404';
      const tempC = weatherResponse.temp_c;

      await this.saveActions(user, actionTime, requestResult, tempC);

      return {
        temperature: parseFloat(tempC.toString()),
        description: weatherResponse.condition.text,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      throw error;
    }
  }

  private async saveActions(
    user: UserEntity,
    actionTime: number,
    requestResult: string,
    tempC: number,
  ): Promise<void> {
    const actionsEntity = new ActionsEntity();
    actionsEntity.user = user;
    actionsEntity.action_time = actionTime;
    actionsEntity.request_result = requestResult;
    actionsEntity.temp_c = tempC;

    await this.actionsRepository.save(actionsEntity);
  }

  async findUserByApiToken(apiToken: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { apiToken } });
  }
}
