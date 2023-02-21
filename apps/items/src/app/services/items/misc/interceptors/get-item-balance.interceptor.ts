import { ItemsView } from '@gscwd-api/models';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class GetItemBalanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((item: ItemsView) => ({
        code: `${item.characteristic_code}-${item.classification_code}-${item.category_code}-${item.specification_code}`,
        item: item.category_name,
        details: item.specification_name,
        balance: item.balance,
      }))
    );
  }
}
