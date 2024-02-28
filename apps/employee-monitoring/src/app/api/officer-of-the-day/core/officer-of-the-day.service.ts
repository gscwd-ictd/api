import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { OfficerOfTheDay, OfficerOfTheDayDto } from '@gscwd-api/models';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmployeesService } from '../../employees/core/employees.service';
import { OrganizationService } from '../../organization/core/organization.service';
import { TypeORMError } from 'typeorm';

@Injectable()
export class OfficerOfTheDayService extends CrudHelper<OfficerOfTheDay> {
  constructor(
    private readonly crudService: CrudService<OfficerOfTheDay>,
    private readonly employeeService: EmployeesService,
    private readonly organizationService: OrganizationService
  ) {
    super(crudService);
  }

  async findAll() {
    const officers = (await this.crudService.findAll()) as OfficerOfTheDay[];
    const officersOfTheDay = await Promise.all(
      officers.map(async (officer) => {
        const { employeeId, dateFrom, dateTo, id, orgId } = officer;
        const employeeName = await this.employeeService.getEmployeeName(employeeId);
        const orgName = await this.organizationService.getOrgNameByOrgId(orgId);
        return { id, employeeName, orgName, dateFrom, dateTo };
      })
    );
    return officersOfTheDay;
  }

  async getAssignableOfficerOfTheDay() {
    const currentlyAssigned = (
      (await this.rawQuery(`SELECT employee_id_fk employeeId FROM officer_of_the_day WHERE now() BETWEEN date_from AND date_to;`)) as {
        employeeId: string;
      }[]
    ).map((emp) => emp.employeeId);
    console.log(currentlyAssigned);

    return await this.employeeService.getAllAssignablePermanentCasualEmployees(currentlyAssigned);
  }

  async getAssignableOrgStruct() {
    const currentlyAssigned = (
      (await this.rawQuery(`SELECT org_id_fk orgId FROM officer_of_the_day WHERE now() BETWEEN date_from AND date_to;`)) as {
        orgId: string;
      }[]
    ).map((org) => org.orgId);
    return await this.organizationService.getAllAvailableOrgStructs(currentlyAssigned);
  }

  async setOfficerOfTheDay(officerOfTheDayDto: OfficerOfTheDayDto) {
    return await this.crud().create({
      dto: officerOfTheDayDto,
      onError: (error: any) => {
        if (error.error.driverError.code === 'ER_DUP_ENTRY') throw new HttpException('Officer of the Day assignment already exists', 406);
        throw new InternalServerErrorException();
      },
    });
  }

  async deleteOfficerOfTheDay(id: string) {
    const result = await this.crud().delete({ deleteBy: { id }, softDelete: false });
    if (result.affected > 0) return id;
  }
}
