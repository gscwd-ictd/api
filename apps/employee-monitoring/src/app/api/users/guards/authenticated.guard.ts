import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    /*
    const request = context.switchToHttp().getRequest();
    //console.log(request);
    console.log('AuthenticatedGuard Activated');
    //console.log(request.session);
    console.log(request.session.isSuperUser);
    if (!request.session.isSuperUser) {
      if (!request.session.user) {
        //2nd or 3rd party
        if (!request.headers.authorization) {
          throw new UnauthorizedException();
        }
      }
    }
    */
    const request = context.switchToHttp().getRequest();
    const user = request.session.user;

    if (user.isEmsUser) return true;
    return false;
  }
}
