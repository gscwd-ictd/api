import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoginUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return {
    userDetails: request.session.user,
    email: request.body.email,
    accessToken: request.bearerToken,
  };
});
