import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateUserLogsDto, UserLogs } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmployeesService } from '../../employees/core/employees.service';

@Injectable()
export class UserLogsService extends CrudHelper<UserLogs> {
  constructor(private readonly crudService: CrudService<UserLogs>, private readonly employeeService: EmployeesService) {
    super(crudService);
  }

  async addLogs(createUserLogsDto: CreateUserLogsDto) {
    const { body, method, route, userId } = createUserLogsDto;

    await this.rawQuery(`INSERT INTO user_logs(user_log_id, route, method, body, user_id_fk) VALUES (uuid(),?,?,?,?);`, [
      route,
      method,
      body,
      userId,
    ]);
  }

  async getLogs() {
    const logs = (await this.crud().findAll({ find: { order: { createdAt: 'DESC' } } })) as UserLogs[];
    const logsDetailed = await Promise.all(
      logs.map(async (log) => {
        const { body, id, method, route, userId, createdAt } = log;
        let userFullName = 'Super User';
        if (userId !== '') userFullName = await this.employeeService.getEmployeeName(userId);

        return { id, dateLogged: createdAt, userFullName };
      })
    );
    return logsDetailed;
  }

  async getLogById(_id: string) {
    const log = await this.crud().findOne({ find: { where: { id: _id } } });
    const { body, createdAt, method, id, route, userId } = log;
    let userFullName = 'Super User';
    if (userId !== '') userFullName = await this.employeeService.getEmployeeName(userId);
    return { id, dateLogged: createdAt, userFullName, body, method, route };
  }
}
