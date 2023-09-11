import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveCardLedgerDebitDto, LeaveCardLedgerDebit } from '@gscwd-api/models';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class LeaveCardLedgerDebitService extends CrudHelper<LeaveCardLedgerDebit> {
  constructor(private readonly crudService: CrudService<LeaveCardLedgerDebit>) {
    super(crudService);
  }

  async addLeaveCardLedgerDebit(leaveCardLedgerDto: CreateLeaveCardLedgerDebitDto) {
    //calculate debit value;
    return await this.crudService.create({
      dto: leaveCardLedgerDto,
      onError: () => new InternalServerErrorException(),
    });
  }

  async getDebitValue(id: string) {
    try {
      return (await this.rawQuery(`SELECT get_debit_value(?) debitValue;`, [id]))[0].debitValue;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
