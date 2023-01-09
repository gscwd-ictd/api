import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { map, Observable } from 'rxjs';
import { ItemDetailsView } from '../data/item-details.view';

@Injectable()
export class FindManyItemViewDetailsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((data: Pagination<ItemDetailsView>) => {
        const items = data.items.map((item) => {
          return {
            code: `${item.characteristic_code}-${item.classification_code}-${item.category_code}-${item.specification_code}`,
            item: {
              characteristic: item.characteristic_name,
              classification: item.classification_name,
              category: item.category_name,
              details: {
                quantity: item.quantity,
                specifications: item.details,
                unit: item.unit_symbol,
                reorder: {
                  point: item.reordering_point,
                  quantity: item.reordering_quantity,
                },
              },
            },
          };
        });

        return { items, meta: data.meta };
      })
    );
  }
}

@Injectable()
export class FindOneItemViewDetailsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((item: ItemDetailsView) => {
        return {
          code: `${item.characteristic_code}-${item.classification_code}-${item.category_code}-${item.specification_code}`,
          item: {
            characteristic: item.characteristic_name,
            classification: item.classification_name,
            category: item.category_name,
            details: {
              quantity: item.quantity,
              specifications: item.details,
              unit: item.unit_symbol,
              reorder: {
                point: item.reordering_point,
                quantity: item.reordering_quantity,
              },
            },
          },
        };
      })
    );
  }
}
