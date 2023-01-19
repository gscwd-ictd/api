import { MicroserviceClient } from '@gscwd-api/microservices';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly client: MicroserviceClient) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
      await this.client.call({
        action: 'emit',
        pattern: 'create_ims_log',
        payload: {
          host: req.hostname,
          url: req.url,
          headers: res.getHeaderNames(),
          method: req.method,
          test: req.httpVersion,
          test3: req.headers.connection,
          // body: req.body,
          // params: req.query,
        },
      });
    }
    next();
  }
}
