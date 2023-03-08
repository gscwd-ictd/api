import { PurchaseRequest, RawPurchaseRequest } from '@gscwd-api/utils';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class CreatePurchaseRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<PurchaseRequest> | Promise<Observable<PurchaseRequest>> {
    return next.handle().pipe(
      map((data: RawPurchaseRequest) => {
        return {
          createdAt: data.createdat,
          updatedAt: data.updatedat,
          deletedAt: data.deletedat,
          id: data.detailsid,
          code: data.prcode,
          account: data.accountid,
          project: data.projectid,
          requestor: data.requestingoffice,
          purpose: data.prpurpose,
          deliverTo: data.deliveryplace,
          type: data.purchasetype,
          status: data.prstatus,
          requestedItems: data.addeditems,
        };
      })
    );
  }
}
