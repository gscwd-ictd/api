import { ItemsView } from '@gscwd-api/models';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class FindItemSummaryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((item: ItemsView) => ({
        id: item.details_id,
        code: `${item.characteristic_code}-${item.classification_code}-${item.category_code}-${item.specification_code}`,
        classification: item.classification_name,
        item: item.category_name,
        unit: item.unit_symbol,
        details: item.specification_name,
        description: item.description,
        balance: item.balance,
        reorder: {
          point: item.reorder_point,
          quantity: item.reorder_quantity,
        },
      }))
    );
  }
}
