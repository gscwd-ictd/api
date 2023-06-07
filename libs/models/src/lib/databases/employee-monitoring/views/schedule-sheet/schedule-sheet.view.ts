import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'schedule_sheet_view',
  expression: `
SELECT 
    cg.custom_group_id id,
    cg.name customGroupName,
    s.name scheduleName, 
    es.date_from dateFrom, 
    es.date_to dateTo 
FROM custom_groups cg 
    RIGHT JOIN custom_group_members cgm ON cgm.custom_group_id_fk  = cg.custom_group_id 
    LEFT JOIN employee_schedule es ON es.employee_id_fk = cgm.employee_id_fk 
    LEFT JOIN \`schedule\` s ON es.schedule_id_fk = s.schedule_id 
GROUP BY id,customGroupName, dateFrom, dateTo, scheduleName`,
})
export class ScheduleSheetView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  customGroupName: string;

  @ViewColumn()
  scheduleName: string;

  @ViewColumn()
  dateFrom: string;

  @ViewColumn()
  dateTo: string;
}
