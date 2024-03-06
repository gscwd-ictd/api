import { CanActivate, ExecutionContext } from '@nestjs/common';

export class DtrCorrectionGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log(request.session.user);
    if (request.session.user) return true;
    return false;
  }
}
