export interface CurrentWeather {
  apiToken: string;
  city: string;
  language: string;
  temp_c: number;
  condition: {
    text: string;
  };
}
