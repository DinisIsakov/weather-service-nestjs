import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../weather/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(authDto: AuthDto): Promise<{ fio: string; apiToken: string }> {
    const { login, password, fio } = authDto;

    try {
      const existingUser = await this.userRepository.findOne({
        where: { login },
      });

      if (existingUser) {
        throw new ConflictException('User with this login already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.userRepository.create({
        login,
        password: hashedPassword,
        fio,
        apiToken: this.generateApiToken(),
      });

      await this.userRepository.save(newUser);

      return { fio: newUser.fio, apiToken: newUser.apiToken };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(
          {
            message: 'User with this login already exists',
            status: HttpStatus.CONFLICT,
          },
          HttpStatus.CONFLICT,
        );
      } else {
        console.error('Error during registration:', error.message);
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  async login(authDto: AuthDto): Promise<{ fio: string; apiToken: string }> {
    const { login, password } = authDto;

    try {
      const user = await this.userRepository.findOne({ where: { login } });

      if (!user) {
        throw new UnauthorizedException('Incorrect login or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect login or password');
      }

      return { fio: user.fio, apiToken: user.apiToken };
    } catch (error) {
      console.error('Error during login:', error.message);
      throw new UnauthorizedException('Incorrect login or password');
    }
  }

  private generateApiToken(): string {
    const timestamp = new Date().getTime().toString();
    return bcrypt.hashSync(timestamp, 10);
  }
}
