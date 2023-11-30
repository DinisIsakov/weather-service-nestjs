import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsString()
  @IsNotEmpty()
  fio: string;

  @IsString()
  @IsNotEmpty()
  apiToken: string;
}
