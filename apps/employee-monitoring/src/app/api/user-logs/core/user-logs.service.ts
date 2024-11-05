import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateUserLogsDto, UserLogs } from '@gscwd-api/models';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmployeesService } from '../../employees/core/employees.service';

@Injectable()
export class UserLogsService extends CrudHelper<UserLogs> {
  constructor(private readonly crudService: CrudService<UserLogs>, private readonly employeeService: EmployeesService) {
    super(crudService);
  }

  async addLogs(createUserLogsDto: CreateUserLogsDto) {
    try {
      const { body, method, route, userId } = createUserLogsDto;

      await this.rawQuery(`INSERT INTO user_logs(user_log_id, route, method, body, user_id_fk) VALUES (uuid(),?,?,?,?);`, [
        route,
        method,
        body,
        userId,
      ]);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getLogs() {
    try {
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
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getLogsByYearMonth(yearMonth: string) {
    try {
      const logs = await this.queryBuilder()
        .where(`DATE_FORMAT(created_at, '%Y-%m' ) = :yearMonth`, { yearMonth })
        .orderBy('created_at', 'DESC')
        .getMany();
      const logsDetailed = await Promise.all(
        logs.map(async (log) => {
          const { body, id, method, route, userId, createdAt } = log;
          let userFullName = 'Super User';
          if (userId !== '') userFullName = await this.employeeService.getEmployeeName(userId);
          return { id, dateLogged: createdAt, userFullName };
        })
      );
      return logsDetailed;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getLogById(_id: string) {
    try {
      const log = await this.crud().findOne({ find: { where: { id: _id } } });
      const { body, createdAt, method, id, route, userId } = log;
      let userFullName = 'Super User';
      if (userId !== '') userFullName = await this.employeeService.getEmployeeName(userId);
      return { id, dateLogged: createdAt, userFullName, body, method, route };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
