import { LspDetails } from '@gscwd-api/models';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { EmployeesService } from '../../../../services/employees';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, map } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class FindLspIndividualInterceptor implements NestInterceptor {
  constructor(private readonly datasource: DataSource, private readonly employeesService: EmployeesService) {}
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map(async (result: Pagination<LspDetails>) => {
        const items = await Promise.all(
          result.items.map(async (lspItems) => {
            let name: string;

            if (lspItems.employeeId === null) {
              name = (await this.datasource.query('select get_lsp_fullname($1) fullname', [lspItems.id]))[0].fullname;
            } else {
              name = (await this.employeesService.findEmployeesById(lspItems.employeeId)).fullName;
            }

            return {
              createdAt: lspItems.createdAt,
              updatedAt: lspItems.updatedAt,
              deletedAt: lspItems.deletedAt,
              id: lspItems.id,
              name: name,
              email: lspItems.email,
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
