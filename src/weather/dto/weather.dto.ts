import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class WeatherDto {
  @IsString()
  @IsNotEmpty()
  apiToken: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsString()
  language?: string;

  constructor() {
    this.language = 'ru';
  }
}
