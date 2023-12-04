import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from './weather/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  retryAttempts: 5,
  retryDelay: 3000,
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [UserEntity],
  synchronize: true,
  autoLoadEntities: true,
  extra: {
    max: 30,
  },
  logging: true,
};
