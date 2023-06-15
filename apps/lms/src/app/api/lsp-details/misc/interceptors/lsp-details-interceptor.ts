import { LspDetails } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

export class LspDetailsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((data: Pagination<LspDetails>) => {
        return {
          ...data,
          items: data.items.map((lsp) => {
            return { ...lsp, trainingSource: lsp.trainingSource.name };
          }),
        };
      })
    );
  }
}
