import { CrudService } from '@gscwd-api/crud';
import { ChartOfAccountsView } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class ChartOfAccountService {
  constructor(private readonly crudService: CrudService<ChartOfAccountsView>) {}

  async findAll(page: number, limit: number) {
    return await this.crudService.findAll({
      pagination: { page, limit },
      find: {
        select: {
          general_ledger_account_id: true,
          account_group_code: true,
          account_group_name: true,
          major_account_group_code: true,
          major_account_group_name: true,
          sub_major_account_group_code: true,
          sub_major_account_group_name: true,
          general_ledger_account_code: true,
          general_ledger_account_name: true,
          contra_account_code: true,
          contra_account_name: true,
        },
      },
      onError: () => new InternalServerErrorException(),
    });
  }

  async findOneBy(id: string) {
    return await this.crudService.findOneBy({
      findBy: { general_ledger_account_id: id },
      onError: () => new NotFoundException(),
    });
  }
}
