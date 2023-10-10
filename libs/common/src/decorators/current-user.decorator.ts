import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDto } from '../dtos';

const getCurrentUserByContext = (context: ExecutionContext): UserDto => {
  return context.switchToHttp().getRequest()['user'];
};

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx),
);
