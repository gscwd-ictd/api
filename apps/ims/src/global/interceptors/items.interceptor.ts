import { ItemDetailsView } from '@gscwd-api/app-entities';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { map, Observable } from 'rxjs';

@Injectable()
export class FindAllItemsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((result: Pagination<ItemDetailsView>) => {
        const items = result.items.map((item: ItemDetailsView) => ({
          id: item.specification_id,
          code: `${item.characteristic_code}-${item.classification_code}-${item.category_code}-${item.specification_code}`,
          classification: item.classification_name,
          item: item.category_name,
          details: item.details,
          description: item.description,
        }));

        return { ...result, items };
      })
    );
  }
}

@Injectable()
export class FindItemByIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((item: ItemDetailsView) => ({
        id: item.specification_id,
        code: `${item.characteristic_code}-${item.classification_code}-${item.category_code}-${item.specification_code}`,
        characteristic: item.characteristic_name,
        classification: item.classification_name,
        specifications: {
          item: item.category_name,
          details: item.details,
          unit: item.unit_symbol,
          description: item.description,
          reorder: {
            point: item.reorder_point,
            quantity: item.reorder_quantity,
          },
        },
        meta: {
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        },
      }))
    );
  }
}
