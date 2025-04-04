import { TrainingDetails } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

@Injectable()
export class FindAllTrainingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map(async (result: Pagination<TrainingDetails>) => {
        const items = await Promise.all(
          result.items.map(async (trainingItems) => {
            return {
              createdAt: trainingItems.createdAt,
              updatedAt: trainingItems.updatedAt,
              deletedAt: trainingItems.deletedAt,
              id: trainingItems.id,
              courseTitle: trainingItems.courseTitle || trainingItems.trainingDesign.courseTitle,
              numberOfParticipants: trainingItems.numberOfParticipants,
              numberOfHours: trainingItems.numberOfHours,
              location: trainingItems.location,
              trainingStart: trainingItems.trainingStart,
              trainingEnd: trainingItems.trainingEnd,
              source: trainingItems.source.name,
              type: trainingItems.type,
              status: trainingItems.status,
            };
          })
        );
        return { ...result, items };
      })
    );
  }
}
