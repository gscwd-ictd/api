import { LspDetails } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { PortalEmployeesService } from '../../../../services/portal';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class FindLspIndividualInterceptor implements NestInterceptor {
  constructor(private readonly datasource: DataSource, private readonly portalEmployeesService: PortalEmployeesService) {}
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map(async (result: Pagination<LspDetails>) => {
        const items = await Promise.all(
          result.items.map(async (lspItems) => {
            let name: string;
            let email: string;

            if (lspItems.employeeId === null) {
              name = (await this.datasource.query('select get_lsp_fullname($1) fullname', [lspItems.id]))[0].fullname;
              email = lspItems.email;
            } else {
              name = (await this.portalEmployeesService.findEmployeesDetailsById(lspItems.employeeId)).fullName;
              email = (await this.portalEmployeesService.findEmployeesDetailsById(lspItems.employeeId)).email;
            }

            return {
              createdAt: lspItems.createdAt,
              updatedAt: lspItems.updatedAt,
              deletedAt: lspItems.deletedAt,
              id: lspItems.id,
              name: name,
              email: email,
              lspSource: lspItems.lspSource,
              postalAddress: lspItems.postalAddress,
            };
          })
        );
        return { ...result, items };
      })
    );
  }
}
