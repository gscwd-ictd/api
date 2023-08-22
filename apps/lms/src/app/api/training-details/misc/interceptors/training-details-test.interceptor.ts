import { TrainingDetailsView } from '@gscwd-api/models';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

@Injectable()
export class FindAllTrainingDetailsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((result: Pagination<TrainingDetailsView>) => {
        const items = result.items.map((views: any) => {
          console.log(views);
          return {
            id: views.training_details_id,
            code: `${views.createdAt}-${views.updatedAt}-${views.deletedAt}`,
          };
        });
        return { ...result, items };
      })
    );
  }
}
