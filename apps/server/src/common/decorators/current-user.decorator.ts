import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from '../../types/auth.types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IAuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IAuthUser;
  },
);
