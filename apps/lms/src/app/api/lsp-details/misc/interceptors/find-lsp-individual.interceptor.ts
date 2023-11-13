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
            let postalAddress: string;
            let sex: string;

            if (lspItems.employeeId === null) {
              name = (await this.datasource.query('select get_lsp_fullname($1) fullname', [lspItems.id]))[0].fullname;
              email = lspItems.email;
              postalAddress = lspItems.postalAddress;
              sex = lspItems.sex;
            } else {
              name = (await this.portalEmployeesService.findEmployeesDetailsById(lspItems.employeeId)).fullName;
              sex = (await this.portalEmployeesService.findEmployeesDetailsById(lspItems.employeeId)).sex;
              email = (await this.portalEmployeesService.findEmployeesDetailsById(lspItems.employeeId)).email;
              postalAddress = (await this.portalEmployeesService.findEmployeesDetailsById(lspItems.employeeId)).postalAddress;
            }

            return {
              createdAt: lspItems.createdAt,
              updatedAt: lspItems.updatedAt,
              deletedAt: lspItems.deletedAt,
              id: lspItems.id,
              name: name,
              sex: sex,
              email: email,
              lspSource: lspItems.lspSource,
              postalAddress: postalAddress,
            };
          })
        );
        return { ...result, items };
      })
    );
  }
}
