import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from 'src/interfaces/payload-jwt.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request['user'] as ActiveUserData;

    return field ? user[field] : user;
  },
);
