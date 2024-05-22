import { LspRankView } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';
import { LspDetailsService } from '../../../lsp-details';

@Injectable()
export class FindLspRankInterceptor implements NestInterceptor {
  constructor(private readonly lspDetailsService: LspDetailsService) {}
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map(async (result: Pagination<LspRankView>) => {
        const items = await Promise.all(
          result.items.map(async (items) => {
            const lspDetails = await this.lspDetailsService.findLspDetailsById(items.lspId);
            return {
              lspId: items.lspId,
              name: lspDetails.name,
              type: lspDetails.type,
              source: lspDetails.source,
              average: parseFloat(items.average.toString()),
            };
          })
        );
        return { ...result, items };
      })
    );
  }
}
