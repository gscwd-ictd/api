import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ItemDetailsView } from '../data/item-details.view';

@Injectable()
export class ItemViewDetailsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((items: ItemDetailsView[]) => {
        return items.map((item) => {
          return {
            itemCode: `${item.characteristic_code}-${item.classification_code}-${item.category_code}-${item.specification_code}`,
            details: {
              quantity: item.quantity,
              specifications: item.details,
              unit: item.unit_symbol,
            },
          };
        });
      })
    );
  }
}
