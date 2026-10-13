import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    Logger.log(request.headers);

    if (request.headers.cookie) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
