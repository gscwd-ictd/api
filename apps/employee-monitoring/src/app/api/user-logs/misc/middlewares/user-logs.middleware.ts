import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SUPER_USER_LOG_ID, UserLogsService } from '../../core/user-logs.service';

@Injectable()
export class UserlogsMiddleware implements NestMiddleware {
  constructor(private readonly userLogsService: UserLogsService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers['origin'] || 'No Origin Header';

    // EMS FE origins to log (comma separated); default: http://<DB_HOST>:3005
    const logOrigins = (process.env.USER_LOG_ORIGINS || 'http://' + process.env.DB_HOST + ':3005').split(',').map((o) => o.trim());
    if (logOrigins.includes(String(origin))) {
      if (req.method !== 'GET') {
        const currentSession = req.session as typeof req.session & { user: { employeeId: string; isSuperUser?: boolean } };
        // log only actions done by a signed-in user (super user -> SUPER_USER_LOG_ID)
        const employeeId = currentSession.user?.isSuperUser ? SUPER_USER_LOG_ID : currentSession.user?.employeeId;
        if (!employeeId) return next();
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
