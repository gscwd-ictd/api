import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: { email: string; _id: string }, context: ExecutionContext) => {
  // get access to the request object
  const request = context.switchToHttp().getRequest();

  // set the data to the current user in session
  data = request.session.user;
  // return the data
  return data;
});
