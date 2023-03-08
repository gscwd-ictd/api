import { RawRequestForQuotation, RequestForQuotationDetails } from '@gscwd-api/utils';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class CreateRequestForQuotationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<RequestForQuotationDetails> {
    return next.handle().pipe(
      map((data: RawRequestForQuotation) => ({
        id: data.rfq_details_id,
        code: data.code,
        status: data.status,
        submitWithin: data.submit_within,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        deletedAt: data.deleted_at,
      }))
    );
  }
}
