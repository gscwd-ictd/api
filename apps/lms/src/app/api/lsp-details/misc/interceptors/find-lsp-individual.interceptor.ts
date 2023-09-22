import { LspDetails } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

@Injectable()
export class FindLspIndividualInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((result: Pagination<LspDetails>) => {
        const lspDetails = result.items.map((item) => ({
          id: item.id,
          name: `${item.prefixName ? item.prefixName + ' ' : ''}${item.firstName || ''} ${item.middleName || ''} ${item.lastName || ''} ${
            item.suffixName || ''
          } ${item.extensionName || ''}`,
          email: item.email,
          source: item.lspSource,
          address: item.postalAddress,
        }));

        return { ...result, items: lspDetails };
      })
    );
  }
}