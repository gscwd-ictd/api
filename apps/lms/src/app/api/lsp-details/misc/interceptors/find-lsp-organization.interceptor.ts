import { LspDetails } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

@Injectable()
export class FindLspOrganizationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((result: Pagination<LspDetails>) => {
        const lspDetails = result.items.map((item) => ({
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          deletedAt: item.deletedAt,
          id: item.id,
          name: `${item.organizationName}`,
          email: item.email,
          source: item.lspSource,
          postalAddress: item.postalAddress,
        }));

        return { ...result, items: lspDetails };
      })
    );
  }
}
