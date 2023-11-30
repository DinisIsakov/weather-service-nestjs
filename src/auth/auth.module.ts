import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from '../weather/entities/user.entity'; // Сохраните только импорт UserEntity
import { ActionsEntity } from '../weather/entities/actions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ActionsEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
