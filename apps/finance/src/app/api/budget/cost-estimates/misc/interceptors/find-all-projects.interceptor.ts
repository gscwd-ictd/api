import { RawProjectDetails } from '@gscwd-api/utils';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';

export class FindAllProjectsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((result: Pagination<RawProjectDetails>) => {
        const projects = result.items.map((item) => ({
          id: item.id,
          projectName: item.projectName,
          location: item.location,
          subject: item.subject,
          workDescription: item.workDescription,
          status: item.budgetDetails.status,
          meta: {
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          },
        }));

        return { ...result, items: projects };
      })
    );
  }
}
