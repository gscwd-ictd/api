import { ItemsView } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { map, Observable } from 'rxjs';

@Injectable()
export class FindAllItemSummariesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((result: Pagination<ItemsView>) => {
        const items = result.items.map((item: ItemsView) => ({
          id: item.details_id,
          code: `${item.characteristic_code}-${item.classification_code}-${item.category_code}-${item.specification_code}`,
          classification: item.classification_name,
          item: item.category_name,
          details: item.specification_name,
          description: item.description,
        }));

        return { ...result, items };
      })
    );
  }
}

@Injectable()
export class FindItemSummaryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((item: ItemsView) => ({
        id: item.details_id,
        code: `${item.characteristic_code}-${item.classification_code}-${item.category_code}-${item.specification_code}`,
        classification: item.classification_name,
        item: item.category_name,
        details: item.specification_name,
        description: item.description,
      }))
    );
  }
}

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
