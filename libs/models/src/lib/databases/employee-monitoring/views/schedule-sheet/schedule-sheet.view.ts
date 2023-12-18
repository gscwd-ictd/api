import { ScheduleBase } from '@gscwd-api/utils';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'schedule_sheet_view',
  expression: `
    SELECT 
        cg.custom_group_id id,
        cg.name customGroupName,
        s.schedule_id scheduleId,
        s.name scheduleName, 
        es.date_from dateFrom, 
        es.date_to dateTo,
        s.schedule_base scheduleBase 
    FROM custom_groups cg 
        RIGHT JOIN custom_group_members cgm ON cgm.custom_group_id_fk  = cg.custom_group_id 
        LEFT JOIN employee_schedule es ON es.employee_id_fk = cgm.employee_id_fk 
        LEFT JOIN \`schedule\` s ON es.schedule_id_fk = s.schedule_id 
    GROUP BY id,customGroupName, dateFrom, dateTo, scheduleName,scheduleId`,
})
export class ScheduleSheetView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  customGroupName: string;

  @ViewColumn()
  scheduleId: string;

  @ViewColumn()
  scheduleName: string;

  @ViewColumn()
  scheduleBase: ScheduleBase;

  @ViewColumn()
  dateFrom: string;

  @ViewColumn()
  dateTo: string;
}
