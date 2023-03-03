import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { DailyTimeRecord } from '@gscwd-api/models';
import { DtrPayload } from '@gscwd-api/utils';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DailyTimeRecordService extends CrudHelper<DailyTimeRecord> {
  constructor(private readonly crudService: CrudService<DailyTimeRecord>, private readonly client: MicroserviceClient) {
    super(crudService);
  }

  async getAllDTR() {
    return await this.client.call({
      action: 'send',
      payload: {},
      pattern: 'get_all_records',
      onError: (error) => new NotFoundException(error),
    });
  }

  async getDtrByCompanyId(companyId: string, dtrPayload: DtrPayload) {
    let dateFrom = new Date(dtrPayload.dateFrom);
    let dateTo = new Date(dtrPayload.dateTo);
    const dayDifference = (dateTo.getTime() - dateFrom.getTime()) / 86400000;
    let days = [];

    for (var i = 0; i <= dayDifference; i++) {
      let day = new Date(dateFrom.setDate(dateFrom.getDate()) + i * 86400000).toISOString().split('T')[0];
      days.push(day);
    }

    const ivmsResult: { companyId: string; dtrDatesResults: { dtrDate: string; employeeDtr: { time24Hr: string; time12Hr: string }[] }[] } =
      await this.client.call<
        string,
        object,
        { companyId: string; dtrDatesResults: { dtrDate: string; employeeDtr: { time24Hr: string; time12Hr: string }[] }[] }
      >({
        action: 'send',
        payload: { companyId, dtrDates: days },
        pattern: 'get_dtr_by_company_id',
        onError: (error) => new NotFoundException(error, { cause: new Error('') }),
      });

    //console.log(ivmsResult);

    const { dtrDatesResults } = ivmsResult;

    console.log(dtrDatesResults);

    const addToLocalDTR = await Promise.all(
      dtrDatesResults.map(async (dtrDatesResult, idx) => {
        //console.log(idx);
        const { dtrDate, employeeDtr } = dtrDatesResult;
        //console.log(dtrDate, ' ', employeeDtr);
        if (employeeDtr.length > 0) {
          if (employeeDtr.length < 4) {
            //check pass slip
            //
          }
        } else {
          //check leave,pass slip, travel order
        }
      })
    );

    //
    //loop per day
    //first kinsenas:  1-15
    //
    //per day check:
    //1. attendance
    //  1.1 if wala:
    //      1.1 if rest period ng schedule niya
    //      1.2 if leave niya
    //      1.3 pass slip
    //      1.4 travel
    //  1.2 if naa:
    //

    return ivmsResult;
  }
}
