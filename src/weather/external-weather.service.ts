import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { CurrentWeather } from './types';

@Injectable()
export class ExternalWeatherService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.apiUrl = 'https://api.weatherapi.com/v1/current.json';
  }

  getWeather(city: string, language: string): Observable<CurrentWeather> {
    const url = this.generateUrl(city, language);
    console.log('Sending weather API request to:', url);

    return this.httpService.get(url).pipe(
      map((response: AxiosResponse<any>) => {
        if (
          !response.data ||
          !response.data.current ||
          !response.data.current.temp_c
        ) {
          throw new Error('Invalid weather data in the API response');
        }

        console.log(
          'Received successful response from external API:',
          response.data,
        );

        return response.data.current as CurrentWeather;
      }),
      catchError((error) => {
        console.error(
          'Error fetching weather data from external API:',
          error.response?.status,
          error.response?.data,
        );

        const errorMessage =
          error.response?.data?.error?.message ||
          'Failed to fetch weather data';

        return throwError(
          () =>
            new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR),
        );
      }),
    );
  }

  private generateUrl(city: string, language: string): string {
    return `${this.apiUrl}?key=${this.apiKey}&q=${city}&lang=${language}`;
  }
}
