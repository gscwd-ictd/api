import { UserLogsService } from '../../core/user-logs.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { UserLogs } from '@gscwd-api/models';

@Injectable()
export class UserLogsInterceptor<T> implements NestInterceptor {
  constructor(private readonly userLogsService: UserLogsService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    console.log(request.session);
    console.log(request.body);
    const user = request.session.user;

    let employeeId = '';

    //if (!user.isSuperUser) {
    employeeId = user.employeeId;
    /// }
    const body = JSON.stringify(request.body);

    await this.userLogsService.addLogs({
      body,
      method: request.method,
      route: request.url,
      userId: employeeId,
    });

    return next.handle().pipe(
      map(async (data: T) => {
        return data;
      })
    );
  }
}
