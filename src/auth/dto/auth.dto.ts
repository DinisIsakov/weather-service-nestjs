import {
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  @IsString({ message: 'Login should be a string' })
  @IsNotEmpty({ message: 'Login should not be empty' })
  login: string;

  @ApiProperty()
  @IsString({ message: 'Password should be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/[\.\,\!\_]/, {
    message:
      'Password must contain at least one of the following characters: . , ! _',
  })
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'FIO should be a string' })
  fio?: string;
}
