import { ChartOfAccountsView } from '@gscwd-api/models';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

@Injectable()
export class FindAllChartOfAccountsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((result: Pagination<ChartOfAccountsView>) => {
        const items = result.items.map((item: ChartOfAccountsView) => ({
          id: item.general_ledger_account_id,
          code: `${item.account_group_code}-${item.major_account_group_code}-${item.sub_major_account_group_code}-${
            item.general_ledger_account_code + item.contra_account_code
          }`,
          name: item.general_ledger_account_name,
        }));
        return { ...result, items };
      })
    );
  }
}
