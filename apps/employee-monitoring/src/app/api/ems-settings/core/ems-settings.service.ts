import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { EmsSettings } from '@gscwd-api/models';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

/** ems_settings.name of an HR pass slip approver row (value = employee id); one row per approver */
export const HR_PASS_SLIP_APPROVER = 'hr_pass_slip_approver';
/** only employees of this HRMS division can be HR pass slip approvers */
export const HR_PASS_SLIP_APPROVER_DIVISION_CODE = 'RPW';

export type HrPassSlipApprover = { id: string; employeeId: string; fullName: string; positionTitle: string };

@Injectable()
export class EmsSettingsService extends CrudHelper<EmsSettings> {
  constructor(private readonly crudService: CrudService<EmsSettings>) {
    super(crudService);
  }

  async getMonetizationConstant() {
    return {
      monetizationConstant: Number.parseFloat(
        (await this.crudService.findOne({ find: { select: { value: true }, where: { name: 'monetization_constant' } } })).value
      ),
    };
  }

  //#region HR pass slip approvers
  /** the HR employees (besides the supervisors) who can approve anybody's pass slip */
  async getHrPassSlipApprovers(): Promise<HrPassSlipApprover[]> {
    const db = process.env.HRMS_DB_NAME;
    return (await this.rawQuery(
      `SELECT s.id, s.value employeeId, TRIM(${db}get_employee_fullname2(s.value)) fullName,
              IFNULL(${db}get_employee_position_or_oic(s.value), '') positionTitle
         FROM ems_settings s
        WHERE s.name = ? AND s.deleted_at IS NULL
        ORDER BY fullName`,
      [HR_PASS_SLIP_APPROVER]
    )) as HrPassSlipApprover[];
  }

  /** dropdown: employees of the Recruitment and Personnel Welfare Division who are not approvers yet */
  async getHrPassSlipApproverOptions(): Promise<{ label: string; value: string }[]> {
    const db = process.env.HRMS_DB_NAME;
    return (await this.rawQuery(
      `SELECT TRIM(${db}get_employee_fullname2(e._id)) label, e._id value
         FROM ${db}employees e
         JOIN ${db}plantilla_positions pp ON pp.employee_id_fk = e._id
         JOIN ${db}division_positions dvp ON dvp.position_id_fk = pp._id
         JOIN ${db}divisions dv ON dv._id = dvp.division_id_fk AND dv.code = ?
        WHERE NOT EXISTS (SELECT 1 FROM ems_settings s WHERE s.name = ? AND s.value = e._id AND s.deleted_at IS NULL)
        ORDER BY label`,
      [HR_PASS_SLIP_APPROVER_DIVISION_CODE, HR_PASS_SLIP_APPROVER]
    )) as { label: string; value: string }[];
  }

  async addHrPassSlipApprover(employeeId: string) {
    if (!employeeId) throw new BadRequestException('Select an employee.');
    const options = await this.getHrPassSlipApproverOptions();
    if (!options.some((o) => o.value === employeeId))
      throw new BadRequestException('Only employees of the Recruitment and Personnel Welfare Division who are not approvers yet can be added.');
    return await this.crudService.create({ dto: { name: HR_PASS_SLIP_APPROVER, value: employeeId } });
  }

  async deleteHrPassSlipApprover(id: string) {
    const rows = (await this.rawQuery(`SELECT id FROM ems_settings WHERE id = ? AND name = ? AND deleted_at IS NULL`, [
      id,
      HR_PASS_SLIP_APPROVER,
    ])) as { id: string }[];
    if (rows.length === 0) throw new NotFoundException('HR pass slip approver not found.');
    await this.rawQuery(`DELETE FROM ems_settings WHERE id = ?`, [id]);
    return { id };
  }

  async isHrPassSlipApprover(employeeId: string) {
    const rows = (await this.rawQuery(`SELECT 1 FROM ems_settings WHERE name = ? AND value = ? AND deleted_at IS NULL LIMIT 1`, [
      HR_PASS_SLIP_APPROVER,
      employeeId,
    ])) as unknown[];
    return { isHrPassSlipApprover: rows.length > 0 };
  }
  //#endregion
}
