import { LspRating } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';
import { TrainingTagsService } from '../../../training/components/tags';

@Injectable()
export class FindAllLspRatingInterceptor implements NestInterceptor {
  constructor(private readonly trainingTagsService: TrainingTagsService) {}
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map(async (result: Pagination<LspRating>) => {
        const items = await Promise.all(
          result.items.map(async (items) => {
            const trainingTags = await this.trainingTagsService.findAllTagsByTrainingId(items.trainingDetails.id);

            return {
              createdAt: items.createdAt,
              updatedAt: items.updatedAt,
              deletedAt: items.deletedAt,
              id: items.id,
              trainingId: items.trainingDetails.id,
              courseTitle: items.trainingDetails.courseTitle || items.trainingDetails.trainingDesign.courseTitle,
              numberOfHours: items.trainingDetails.numberOfHours,
              numberOfParticipants: items.trainingDetails.numberOfParticipants,
              location: items.trainingDetails.location,
              trainingStart: items.trainingDetails.trainingStart,
              trainingEnd: items.trainingDetails.trainingEnd,
              source: items.trainingDetails.source.name,
              type: items.trainingDetails.type,
              status: items.trainingDetails.status,
              lspDetails: items.lspDetails.fullName || items.lspDetails.organizationName,
              trainingTags: trainingTags,
              rating: items.rating,
            };
          })
        );
        return { ...result, items };
      })
    );
  }
}
