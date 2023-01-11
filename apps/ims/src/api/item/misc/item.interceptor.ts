import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ItemSpecification } from '../components/specification';

@Injectable()
export class FindItemByIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((item: ItemSpecification) => ({
        id: item.id,
        code: `${item.category.classification.characteristic.code}-${item.category.classification.code}-${item.category.code}-${item.code}`,
        characteristic: item.category.classification.characteristic.name,
        classification: item.category.classification.name,
        category: item.category.name,
        specifications: {
          code: item.code,
          details: item.details,
          quantity: item.quantity,
          unit: item.unit.symbol,
          description: item.description,
          reorder: {
            point: item.reorderPoint,
            quantity: item.reorderQuantity,
          },
        },
        meta: {
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        },
      }))
    );
  }
}
