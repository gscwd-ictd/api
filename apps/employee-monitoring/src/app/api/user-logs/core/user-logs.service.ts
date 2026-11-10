import dayjs = require('dayjs');
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateUserLogsDto, UserLogs } from '@gscwd-api/models';
import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EmployeesService } from '../../employees/core/employees.service';
import { describeUserLog } from '../utils/user-log-description.util';

/** user_id_fk of actions done by the super user (no employee record) */
export const SUPER_USER_LOG_ID = 'super-user';

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
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * System logs between two dates (YYYY-MM-DD, inclusive), newest first. Default: the last 30 days.
   * action = what the user did, in plain words (e.g. "Updated a pass slip (status: approved)").
   */
  async getLogs(dateFrom?: string, dateTo?: string) {
    const isDate = (d?: string) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);
    const to = isDate(dateTo) ? dateTo : dayjs().format('YYYY-MM-DD');
    const from = isDate(dateFrom) ? dateFrom : dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    try {
      const rows = (await this.rawQuery(
        `
        SELECT
          user_log_id id,
          DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') dateLogged,
          CASE WHEN user_id_fk = '${SUPER_USER_LOG_ID}' THEN 'Super User'
               ELSE COALESCE(${process.env.HRMS_DB_NAME}get_employee_fullname2(user_id_fk), CONCAT('Unknown user (', user_id_fk, ')')) END userFullName,
          method, route, body
        FROM user_logs
        WHERE user_id_fk IS NOT NULL AND user_id_fk <> ''
          AND created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 1 DAY)
        ORDER BY created_at DESC;`,
        [from, to]
      )) as { id: string; dateLogged: string; userFullName: string; method: string; route: string; body: string }[];
      return rows.map(({ method, route, body, ...row }) => ({ ...row, action: describeUserLog(method, route, body) }));
    } catch (error) {
      throw new NotFoundException(error.message);
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
      throw new NotFoundException(error.message);
    }
  }

  async getLogById(_id: string) {
    try {
      const log = await this.crud().findOne({ find: { where: { id: _id } } });
      const { body, createdAt, method, id, route, userId } = log;
      let userFullName = 'Super User';
      if (userId && userId !== SUPER_USER_LOG_ID) userFullName = (await this.employeeService.getEmployeeName(userId)) ?? `Unknown user (${userId})`;
      return { id, dateLogged: createdAt, userFullName, body, method, route, action: describeUserLog(method, route, body) };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
