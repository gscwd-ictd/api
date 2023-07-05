import { TrainingDetails } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

export class TrainingDetailsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((data: Pagination<TrainingDetails>) => {
        return {
          ...data,
          items: data.items.map((trainingDetails) => {
            return { ...trainingDetails, trainingSource: trainingDetails.trainingSource.name };
          }),
        };
      })
    );
  }
}
