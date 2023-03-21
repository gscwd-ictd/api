import { ChartOfAccountsView } from '@gscwd-api/models';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

@Injectable()
export class FindAllChartOfAccountsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((result: Pagination<ChartOfAccountsView>) => {
        const items = result.items.map((chartOfAccount: ChartOfAccountsView) => ({
          id: chartOfAccount.general_ledger_account_id,
          code: `${chartOfAccount.account_group_code}-${chartOfAccount.major_account_group_code}-${chartOfAccount.sub_major_account_group_code}-${
            chartOfAccount.general_ledger_account_code + chartOfAccount.contra_account_code
          }`,
          name: chartOfAccount.general_ledger_account_name,
        }));
        return { ...result, items };
      })
    );
  }
}
