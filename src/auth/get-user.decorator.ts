import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../weather/entities/user.entity';

export const GetUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserEntity => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
