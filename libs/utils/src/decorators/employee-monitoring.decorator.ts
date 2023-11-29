import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoginUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (typeof request.session.user !== 'undefined') return { employeeId: request.session.user.employeeId, name: request.session.user.fullName };
  return null;
});
