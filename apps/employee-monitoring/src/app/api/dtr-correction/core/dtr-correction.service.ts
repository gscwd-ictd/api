import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { ApproveDtrCorrectionDto, CreateDtrCorrectionDto, DtrCorrection } from '@gscwd-api/models';
import { DtrCorrectionStatus, DtrCorrectionsType } from '@gscwd-api/utils';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmployeesService } from '../../employees/core/employees.service';
import { DailyTimeRecordService } from '../../daily-time-record/core/daily-time-record.service';
import { timeout } from 'rxjs';

@Injectable()
export class DtrCorrectionService extends CrudHelper<DtrCorrection> {
  constructor(
    private readonly crudService: CrudService<DtrCorrection>,
    private readonly employeeService: EmployeesService,
    private readonly dailyTimeRecordService: DailyTimeRecordService
  ) {
    super(crudService);
  }

  async addDtrCorrection(createDtrCorrectionDto: CreateDtrCorrectionDto) {
    const { lunchIn, lunchOut, timeIn, timeOut, companyId, dtrDate, dtrId, } = createDtrCorrectionDto;
    let _dtrId = null;
    if (dtrId === null) {
      _dtrId = await this.dailyTimeRecordService.crud().create({
        dto: {
          companyId, timeIn: null, timeOut: null, lunchIn: null, lunchOut: null, dtrDate, hasCorrection: true
        }
      })
    }

    return await this.crudService.create({
      dto: {
        timeIn, lunchOut, lunchIn, timeOut, status: DtrCorrectionStatus.FOR_APPROVAL, dtrId: dtrId === null ? _dtrId : dtrId
      },
      onError: (error: any) => {
        if (error.error.driverError.code === 'ER_DUP_ENTRY') throw new HttpException('Time log correction already exists.', 406);
        throw new InternalServerErrorException();
      },
    });
  }

  async getPendingDtrCorrections(employeeId: string) {
    try {
      const employees = await this.employeeService.getEmployeesUnderSupervisor(employeeId);
      const companyIds = employees.map((emp) => emp.companyId);
      return parseInt(
        (
          await this.rawQuery(
            `
              SELECT COUNT(*) pendingDtrCorrections
                FROM dtr_correction dtrc 
              INNER JOIN 
                daily_time_record dtr ON dtr.daily_time_record_id = dtrc.daily_time_record_id_fk
              WHERE dtrc.status = 'for approval' AND company_id_fk IN (?);`,
            [companyIds]
          )
        )[0].pendingDtrCorrections
      );
    } catch (error) {
      return 0;
    }
  }

  async getDtrCorrections(employeeId: any): Promise<DtrCorrectionsType[]> {
    //get company id of supervised employees

    const companyIds = (await this.employeeService.getEmployeesUnderSupervisor(employeeId)).map((emp) => emp.companyId);

    const dtrCorrections = (await this.rawQuery(
      `
        SELECT 
          dtrc.dtr_correction_id id,
          dtr.daily_time_record_id dtrId,
          dtr.company_id_fk companyId,
          DATE_FORMAT(dtr.dtr_date,'%Y-%m-%d') dtrDate,
          dtr.time_in dtrTimeIn, 
          dtrc.time_in correctedTimeIn,
          dtr.lunch_out dtrLunchOut,
          dtrc.lunch_out correctedLunchOut,
          dtr.lunch_in dtrLunchIn,
          dtrc.lunch_in correctedLunchIn,
          dtr.time_out dtrTimeOut,
          dtrc.time_out correctedTimeOut,
          dtrc.\`status\` \`status\`,
          dtrc.remarks remarks
        FROM dtr_correction dtrc 
        INNER JOIN daily_time_record dtr ON dtr.daily_time_record_id = dtrc.daily_time_record_id_fk 
        WHERE dtr.company_id_fk IN (?) ORDER BY dtrc.status ASC, DATE_FORMAT(dtr.dtr_date,'%Y-%m-%d') DESC;
    `,
      [companyIds]
    )) as DtrCorrectionsType[];

    const dtrCorrectionsWithEmployeeName = await Promise.all(
      dtrCorrections.map(async (dtrCorrection) => {
        const { companyId, ...restOfDtrCorrection } = dtrCorrection;
        const employeeFullName = (await this.employeeService.getEmployeeDetailsByCompanyId(companyId)).employeeFullName;
        return { companyId, employeeFullName, ...restOfDtrCorrection };
      })
    );

    return dtrCorrectionsWithEmployeeName;
  }

  async approvalOfDtrCorrection(approveDtrCorrectionDto: ApproveDtrCorrectionDto) {
    const { id, status } = approveDtrCorrectionDto;
    const result = await this.crud().update({ dto: { status }, updateBy: { id } });
    if (result.affected > 0) {
      if (status === 'approved') {
        const correctedDtr = await this.crudService.findOne({
          find: {
            select: { id: true, dtrId: { id: true }, timeIn: true, lunchOut: true, lunchIn: true, timeOut: true },
            where: { id },
            relations: { dtrId: true },
          },
        });

        const { dtrId, lunchIn, lunchOut, timeIn, timeOut } = correctedDtr;
        const dtrUpdateResult = await this.dailyTimeRecordService
          .crud()
          .update({ dto: { timeIn, timeOut, lunchIn, lunchOut, hasCorrection: true }, updateBy: { id: dtrId.id } });
        if (dtrUpdateResult.affected > 0) return approveDtrCorrectionDto;
      }
      return approveDtrCorrectionDto;
    }
  }
}
