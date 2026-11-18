import { BadRequestException, Injectable } from '@nestjs/common';
import { PassSlipService } from '../../pass-slip/core/pass-slip.service';
import { CHART_TYPES, DateRange, ChartType, chartCountsQuery, chartEmployeesQuery, ORG_LEVELS, OrgLevel } from './charts.query';
import dayjs = require('dayjs');

export type ChartFilter = { level?: string; dateFrom?: string; dateTo?: string; orgId?: string; category?: string };

@Injectable()
export class ChartsService {
  constructor(private readonly passSlipService: PassSlipService) {}

  private check(type: string, filter: ChartFilter) {
    if (!CHART_TYPES.includes(type as ChartType)) throw new BadRequestException(`Unknown chart: ${type}`);
    const level = (filter.level ?? 'department') as OrgLevel;
    if (!ORG_LEVELS.includes(level)) throw new BadRequestException(`Unknown level: ${filter.level}`);
    // default: January 1 of this year to today
    const dateFrom = filter.dateFrom ?? dayjs().startOf('year').format('YYYY-MM-DD');
    const dateTo = filter.dateTo ?? dayjs().format('YYYY-MM-DD');
    const valid = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d) && dayjs(d).isValid();
    if (!valid(dateFrom) || !valid(dateTo)) throw new BadRequestException('dateFrom and dateTo must be YYYY-MM-DD');
    if (dateFrom > dateTo) throw new BadRequestException('dateFrom must be on or before dateTo');
    return { type: type as ChartType, level, range: [dateFrom, dateTo] as DateRange };
  }

  /** chart bars: [{ orgId, orgCode, orgName, category, count }] */
  async getCounts(type: string, filter: ChartFilter) {
    const { level, range } = this.check(type, filter);
    const q = chartCountsQuery(type as ChartType, level, range, process.env.HRMS_DB_NAME);
    return ((await this.passSlipService.rawQuery(q.sql, q.params)) as any[]).map((r) => ({ ...r, count: Number(r.count) }));
  }

  /** per employee: [{ employeeId, companyId, fullName, orgName, category, count }] (one org / category when given) */
  async getEmployees(type: string, filter: ChartFilter) {
    const { level, range } = this.check(type, filter);
    const q = chartEmployeesQuery(type as ChartType, level, range, process.env.HRMS_DB_NAME, filter.orgId, filter.category);
    return ((await this.passSlipService.rawQuery(q.sql, q.params)) as any[]).map((r) => ({
      ...r,
      fullName: (r.fullName ?? '').trim(),
      count: Number(r.count),
    }));
  }
}
