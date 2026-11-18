import { BadRequestException, Injectable } from '@nestjs/common';
import { PassSlipService } from '../../pass-slip/core/pass-slip.service';
import { CHART_TYPES, ChartType, chartCountsQuery, chartEmployeesQuery, ORG_LEVELS, OrgLevel } from './charts.query';
import dayjs = require('dayjs');

export type ChartFilter = { level?: string; year?: string; orgId?: string; category?: string };

@Injectable()
export class ChartsService {
  constructor(private readonly passSlipService: PassSlipService) {}

  private check(type: string, filter: ChartFilter) {
    if (!CHART_TYPES.includes(type as ChartType)) throw new BadRequestException(`Unknown chart: ${type}`);
    const level = (filter.level ?? 'department') as OrgLevel;
    if (!ORG_LEVELS.includes(level)) throw new BadRequestException(`Unknown level: ${filter.level}`);
    const year = filter.year ? Number(filter.year) : dayjs().year();
    if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new BadRequestException(`Invalid year: ${filter.year}`);
    return { type: type as ChartType, level, year };
  }

  /** chart bars: [{ orgId, orgCode, orgName, category, count }] */
  async getCounts(type: string, filter: ChartFilter) {
    const { level, year } = this.check(type, filter);
    const q = chartCountsQuery(type as ChartType, level, year, process.env.HRMS_DB_NAME);
    return ((await this.passSlipService.rawQuery(q.sql, q.params)) as any[]).map((r) => ({ ...r, count: Number(r.count) }));
  }

  /** per employee: [{ employeeId, companyId, fullName, orgName, category, count }] (one org / category when given) */
  async getEmployees(type: string, filter: ChartFilter) {
    const { level, year } = this.check(type, filter);
    const q = chartEmployeesQuery(type as ChartType, level, year, process.env.HRMS_DB_NAME, filter.orgId, filter.category);
    return ((await this.passSlipService.rawQuery(q.sql, q.params)) as any[]).map((r) => ({
      ...r,
      fullName: (r.fullName ?? '').trim(),
      count: Number(r.count),
    }));
  }
}
