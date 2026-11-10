import { SUPER_USER_LOG_ID, UserLogsService } from '../../core/user-logs.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { UserLogs } from '@gscwd-api/models';

@Injectable()
export class UserLogsInterceptor<T> implements NestInterceptor {
  constructor(private readonly userLogsService: UserLogsService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const user = request.session?.user;
    // log only actions done by a signed-in user (super user -> SUPER_USER_LOG_ID)
    const employeeId = user?.isSuperUser ? SUPER_USER_LOG_ID : user?.employeeId;
    const body = JSON.stringify(request.body);

    if (employeeId) await this.userLogsService.addLogs({
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
