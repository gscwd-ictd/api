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
    try {
      const { lunchIn, lunchOut, timeIn, timeOut, companyId, dtrDate, dtrId, remarks } = createDtrCorrectionDto;
      let _dtrId = null;

      const dtrIdByCompanyIdAndDate = await this.dailyTimeRecordService.crud().findOneOrNull({ find: { where: { dtrDate, companyId } } });

      if (dtrId === null && dtrIdByCompanyIdAndDate === null) {
        _dtrId = await this.dailyTimeRecordService.createDtrOnce({
          dto: {
            companyId,
            timeIn: null,
            timeOut: null,
            lunchIn: null,
            lunchOut: null,
            dtrDate,
            hasCorrection: true,
          },
        });
      }

      return await this.crudService.create({
        dto: {
          timeIn,
          lunchOut,
          lunchIn,
          timeOut,
          remarks,
          status: DtrCorrectionStatus.FOR_APPROVAL,
          dtrId: dtrId === null ? (dtrIdByCompanyIdAndDate === null ? _dtrId : dtrIdByCompanyIdAndDate) : dtrId,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
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

  /**
   * All time log correction (TLC) requests for HR, newest first: employee, DTR date, original and corrected
   * time logs, status and remarks. Optional filters: DTR date range and status.
   */
  async getAllDtrCorrectionsForHr(dateFrom?: string, dateTo?: string, status?: string) {
    const hrms = process.env.HRMS_DB_NAME;
    const where: string[] = ['dtrc.deleted_at IS NULL'];
    const params: string[] = [];
    if (dateFrom) {
      where.push('dtr.dtr_date >= ?');
      params.push(dateFrom);
    }
    if (dateTo) {
      where.push('dtr.dtr_date <= ?');
      params.push(dateTo);
    }
    if (status) {
      where.push('dtrc.status = ?');
      params.push(status);
    }
    return await this.rawQuery(
      `SELECT
          dtrc.dtr_correction_id id,
          dtr.daily_time_record_id dtrId,
          dtr.company_id_fk companyId,
          emp._id employeeId,
          ${hrms}get_employee_fullname2(emp._id) employeeFullName,
          ${hrms}get_employee_assignment(emp._id) assignment,
          DATE_FORMAT(dtr.dtr_date, '%Y-%m-%d') dtrDate,
          TIME_FORMAT(dtr.time_in, '%H:%i') dtrTimeIn,
          TIME_FORMAT(dtrc.time_in, '%H:%i') correctedTimeIn,
          TIME_FORMAT(dtr.lunch_out, '%H:%i') dtrLunchOut,
          TIME_FORMAT(dtrc.lunch_out, '%H:%i') correctedLunchOut,
          TIME_FORMAT(dtr.lunch_in, '%H:%i') dtrLunchIn,
          TIME_FORMAT(dtrc.lunch_in, '%H:%i') correctedLunchIn,
          TIME_FORMAT(dtr.time_out, '%H:%i') dtrTimeOut,
          TIME_FORMAT(dtrc.time_out, '%H:%i') correctedTimeOut,
          dtrc.status status,
          dtrc.remarks remarks,
          DATE_FORMAT(dtrc.created_at, '%Y-%m-%d %H:%i') dateFiled,
          IF(dtrc.status = 'for approval', NULL, DATE_FORMAT(dtrc.updated_at, '%Y-%m-%d %H:%i')) dateActed
        FROM dtr_correction dtrc
        INNER JOIN daily_time_record dtr ON dtr.daily_time_record_id = dtrc.daily_time_record_id_fk
        LEFT JOIN ${hrms}employees emp ON emp.company_id = dtr.company_id_fk
       WHERE ${where.join(' AND ')}
       ORDER BY dtrc.created_at DESC;`,
      params
    );
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
