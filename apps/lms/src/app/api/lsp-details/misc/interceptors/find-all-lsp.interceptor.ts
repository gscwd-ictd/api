import { LspDetails } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { PortalEmployeesService } from '../../../../services/portal';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';
import { LspSource, LspType } from '@gscwd-api/utils';

@Injectable()
export class FindAllLspInterceptor implements NestInterceptor {
  constructor(private readonly portalEmployeesService: PortalEmployeesService) {}
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map(async (result: Pagination<LspDetails>) => {
        const items = await Promise.all(
          result.items.map(async (lspItems) => {
            /* check if type individual or organization) */

            /* type individual */
            if (lspItems.type === LspType.INDIVIDUAL) {
              let name: string;
              let email: string;
              let postalAddress: string;
              let sex: string;
              let tin: string;

              /* check if source internal or external */
              if (lspItems.source === LspSource.INTERNAL) {
                /* find employee details by employeed id */
                const employeeDetails = await this.portalEmployeesService.findEmployeesDetailsById(lspItems.employeeId);
                name = employeeDetails.fullName;
                sex = employeeDetails.sex;
                email = employeeDetails.email;
                tin = employeeDetails.tin;
                postalAddress = employeeDetails.postalAddress;
              } else if (lspItems.source === LspSource.EXTERNAL) {
                name = lspItems.fullName;
                sex = lspItems.sex;
                email = lspItems.email;
                tin = lspItems.tin;
                postalAddress = lspItems.postalAddress;
              }

              return {
                createdAt: lspItems.createdAt,
                updatedAt: lspItems.updatedAt,
                deletedAt: lspItems.deletedAt,
                id: lspItems.id,
                name: name,
                sex: sex,
                email: email,
                tin: tin,
                postalAddress: postalAddress,
                type: lspItems.type,
                source: lspItems.source,
              };
            } else if (lspItems.type === LspType.ORGANIZATION) {
              /* type organization */
              return {
                createdAt: lspItems.createdAt,
                updatedAt: lspItems.updatedAt,
                deletedAt: lspItems.deletedAt,
                id: lspItems.id,
                name: lspItems.organizationName,
                email: lspItems.email,
                tin: lspItems.tin,
                postalAddress: lspItems.postalAddress,
                type: lspItems.type,
                source: lspItems.source,
              };
            }
          })
        );
        return { ...result, items };
      })
    );
  }
}
