import { TrainingDetails } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

export class FindTrainingDetailsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map(async (result: Pagination<TrainingDetails>) => {
        const items = await Promise.all(
          result.items.map(async (results) => {
            return {
              createdAt: results.createdAt,
              updatedAt: results.updatedAt,
              deletedAt: results.deletedAt,
              id: results.id,
              courseTitle: results.courseTitle || results.trainingDesign.courseTitle,
              location: results.location,
              trainingStart: results.trainingStart,
              trainingEnd: results.trainingEnd,
              bucketFiles: JSON.parse(results.bucketFiles),
              trainingSource: results.trainingSource.name,
              trainingType: results.trainingType,
              preparationStatus: results.trainingPreparationStatus,
            };
          })
        );
        return {
          ...result,
          items,
        };
      })
    );
  }
}
