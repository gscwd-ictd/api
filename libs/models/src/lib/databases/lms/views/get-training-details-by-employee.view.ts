import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'get_employee_training_details_view',
  expression: `
    select 
        tn.employee_id_fk,
        coalesce(td.course_title, tde.course_title) as course_title, 
        td.training_start, 
        td.training_end, 
        td.number_of_hours, 
        td.training_type, 
        coalesce(
            nullif(ld.organization_name, ''),
            concat_ws(' ', ld.first_name, ld.middle_name, ld.last_name)
        ) as lsp_name
    from training_details td
    inner join training_designs tde on td.training_design_id_fk = tde.training_design_id
    inner join training_lsp_details tsd on tsd.training_details_id_fk = td.training_details_id
    inner join lsp_details ld on ld.lsp_details_id = tsd.lsp_details_id_fk
    inner join training_distributions tdi on tdi.training_details_id_fk = td.training_details_id
    inner join training_nominees tn on tn.training_distribution_id_fk = tdi.training_distribution_id 
    where td.status = 'completed' and tn.status = 'accepted'
  
  `,
})
export class EmployeeTrainingView {
  @ViewColumn({ name: 'employee_id_fk' })
  employeeId: string;

  @ViewColumn({ name: 'course_title' })
  courseTitle: string;

  @ViewColumn({ name: 'training_start' })
  trainingStart: Date;

  @ViewColumn({ name: 'training_end' })
  trainingEnd: Date;

  @ViewColumn({ name: 'number_of_hours' })
  numberOfHours: number;

  @ViewColumn({ name: 'training_type' })
  trainingType: string;

  @ViewColumn({ name: 'lsp_name' })
  lspName: string;
}
