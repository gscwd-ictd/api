import { LspRating } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';
import { TrainingTagsService } from '../../../training/components/tags';
import { LspDetailsService } from '../../../lsp-details';

@Injectable()
export class FindAllLspRatingInterceptor implements NestInterceptor {
  constructor(private readonly trainingTagsService: TrainingTagsService, private readonly lspDetailsService: LspDetailsService) {}
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map(async (result: Pagination<LspRating>) => {
        const items = await Promise.all(
          result.items.map(async (items) => {
            const trainingTags = await this.trainingTagsService.findAllTagsByTrainingId(items.trainingDetails.id);
            const lspName = (await this.lspDetailsService.findLspDetailsById(items.lspDetails.id)).name;
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
              lspDetails: lspName,
              trainingTags: trainingTags,
              rating: parseFloat(items.rating.toString()),
            };
          })
        );
        return { ...result, items };
      })
    );
  }
}
