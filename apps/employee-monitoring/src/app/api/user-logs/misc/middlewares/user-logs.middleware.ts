import { ExecutionContext, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserLogsService } from '../../core/user-logs.service';

@Injectable()
export class UserlogsMiddleware implements NestMiddleware {
  constructor(private readonly userLogsService: UserLogsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers['origin'] || 'No Origin Header';

    if (origin === 'http://' + process.env.DB_HOST + ':3005') {
      if (req.method !== 'GET') {
        console.log('request', req.originalUrl);
        const currentSession = req.session as typeof req.session & { user: { employeeId: string; isSuperUser?: boolean } };
        let employeeId = currentSession.user.employeeId;
        if (!currentSession.user.isSuperUser) {
          employeeId = currentSession.user.employeeId;
        }
        const body = JSON.stringify(req.body);
        await this.userLogsService.addLogs({
          body,
          method: req.method,
          route: req.originalUrl,
          userId: employeeId,
        });
      }
    }
    next();
  }
}
