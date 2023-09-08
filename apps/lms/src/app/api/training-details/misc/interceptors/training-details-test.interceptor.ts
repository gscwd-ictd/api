import { TrainingDetailsView } from '@gscwd-api/models';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

@Injectable()
export class FindAllTrainingDetailsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((result: Pagination<TrainingDetailsView>) => {
        const items = result.items.map((views) => {
          return {
            createdAt: result.items[0].createdAt,
            updateAt: result.items[0].updatedAt,
            deletedAt: result.items[0].deletedAt,
            id: views.id,
            trainingSource: views.trainingSource,
            trainingType: result.items[0].trainingType,
            //trainingSourceId: views.trainingTypeId,
          };
        });
        return { ...result, items };
      })
    );
  }
}
