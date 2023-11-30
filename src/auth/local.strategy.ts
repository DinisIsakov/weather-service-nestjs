import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<{ fio: string; apiToken: string } | null> {
    try {
      const user = await this.authService.login({ login: username, password });
      return user || null;
    } catch (error) {
      console.error('Error during local strategy validation:', error.message);
      throw new UnauthorizedException('Incorrect login or password');
    }
  }
}
