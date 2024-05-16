import { LspRating } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

@Injectable()
export class FindAllLspRatingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map(async (result: Pagination<LspRating>) => {
        const items = await Promise.all(
          result.items.map(async (items) => {
            return {
              createdAt: items.createdAt,
              updatedAt: items.updatedAt,
              deletedAt: items.deletedAt,
              id: items.id,
              courseTitle: items.trainingDetails.courseTitle || items.trainingDetails.trainingDesign.courseTitle,
              trainingStart: items.trainingDetails.trainingStart,
              trainingEnd: items.trainingDetails.trainingEnd,
              source: items.trainingDetails.source.name,
              type: items.trainingDetails.type,
              status: items.trainingDetails.status,
              rating: items.rating,
            };
          })
        );
        return { ...result, items };
      })
    );
  }
}
