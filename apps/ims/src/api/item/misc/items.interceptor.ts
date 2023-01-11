import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { map, Observable } from 'rxjs';
import { ItemDetailsView } from '../data/item-details.view';

@Injectable()
export class FindAllItemsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((result: Pagination<ItemDetailsView>) => {
        const items = result.items.map((item: ItemDetailsView) => ({
          id: item.id,
          code: `${item.characteristic_code}-${item.classification_code}-${item.category_code}-${item.specification_code}`,
          category: item.category_name,
          details: item.details,
          description: item.description,
        }));

        return { ...result, items };
      })
    );
  }
}
