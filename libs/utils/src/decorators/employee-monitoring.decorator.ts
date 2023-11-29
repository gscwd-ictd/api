import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoginUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  //console.log(request.session);

  // return {
  //   userDetails: request.session.user,

  // };
  //if (request.session) return { employeeId: request.session.user.employeeId, name: request.session.user.fullName };
  return null;
});
