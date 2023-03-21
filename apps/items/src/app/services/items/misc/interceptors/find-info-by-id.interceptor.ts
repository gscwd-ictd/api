import { ItemsView } from '@gscwd-api/models';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class FindItemInfoByIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((item: ItemsView) => ({
        id: item.details_id,
        code: `${item.characteristic_code}-${item.classification_code}-${item.category_code}-${item.specification_code}`,
        characteristic: item.characteristic_name,
        classification: item.classification_name,
        specifications: {
          item: item.category_name,
          details: item.specification_name,
          description: item.description,
          balance: item.balance,
          unit: {
            name: item.unit_name,
            symbol: item.unit_symbol,
          },
          reorder: {
            point: item.reorder_point,
            quantity: item.reorder_quantity,
          },
        },
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }))
    );
  }
}
