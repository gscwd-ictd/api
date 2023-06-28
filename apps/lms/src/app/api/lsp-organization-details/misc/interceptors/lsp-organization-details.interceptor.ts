import { LspOrganizationDetails } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

export class LspOrganizationDetailsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((data: Pagination<LspOrganizationDetails>) => {
        return {
          ...data,
          items: data.items.map((lsp) => {
            return { ...lsp, lspSource: lsp.lspSource.name };
          }),
        };
      })
    );
  }
}
