import { Controller, Post, Body, ValidationPipe, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  private logAndReturnSuccess(action: string, data: any): any {
    this.logger.log(`${action} successful: ${JSON.stringify(data)}`);
    return data;
  }

  private logAndThrowError(action: string, error: Error): never {
    this.logger.error(`${action} failed`, error.stack);
    throw error;
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: AuthDto })
  async register(@Body(ValidationPipe) authDto: AuthDto) {
    this.logger.log(
      'Received registration request: ' + JSON.stringify(authDto),
    );

    try {
      const result = await this.authService.register(authDto);
      return this.logAndReturnSuccess('Registration', result);
    } catch (error) {
      return this.logAndThrowError('Registration', error);
    }
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: AuthDto })
  async login(@Body(ValidationPipe) authDto: AuthDto) {
    this.logger.log('Received login request: ' + JSON.stringify(authDto));

    try {
      const result = await this.authService.login(authDto);
      return this.logAndReturnSuccess('Login', result);
    } catch (error) {
      return this.logAndThrowError('Login', error);
    }
  }
}
