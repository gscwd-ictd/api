import { LspDetails } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { PortalEmployeesService } from '../../../../services/portal';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';
import { DataSource } from 'typeorm';
import { LspSource, LspType } from '@gscwd-api/utils';

@Injectable()
export class LspInterceptor implements NestInterceptor {
  constructor(private readonly datasource: DataSource, private readonly portalEmployeesService: PortalEmployeesService) {}
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map(async (result: Pagination<LspDetails>) => {
        const items = await Promise.all(
          result.items.map(async (lspItems) => {
            if (lspItems.type === LspType.INDIVIDUAL) {
              let name: string;
              let email: string;
              let postalAddress: string;
              let sex: string;
              let tin: string;

              if (lspItems.source === LspSource.EXTERNAL) {
                name = lspItems.fullName;
                sex = lspItems.sex;
                email = lspItems.email;
                tin = lspItems.tin;
                postalAddress = lspItems.postalAddress;
              } else {
                const employeeDetails = await this.portalEmployeesService.findEmployeesDetailsById(lspItems.employeeId);
                name = employeeDetails.fullName;
                sex = employeeDetails.sex;
                email = employeeDetails.email;
                tin = employeeDetails.tin;
                postalAddress = employeeDetails.postalAddress;
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
              return {
                createdAt: lspItems.createdAt,
                updatedAt: lspItems.updatedAt,
                deletedAt: lspItems.deletedAt,
                id: lspItems.id,
                name: lspItems.organizationName,
                email: lspItems.email,
                tin: lspItems.tin,
                postalAddress: lspItems.postalAddress,
                type: lspItems.source,
                source: lspItems.type,
              };
            }
          })
        );
        return { ...result, items };
      })
    );
  }
}
