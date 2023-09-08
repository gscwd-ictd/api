import {
  TrainingDetails,
  TrainingDistribution,
  TrainingLspIndividual,
  TrainingLspOrganization,
  TrainingRecommendedEmployee,
  TrainingSource,
  TrainingTag,
} from '@gscwd-api/models';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'training_details_test_view',
  expression: (datasource) =>
    datasource
      .createQueryBuilder()
      .select('td.created_at', 'created_at')
      .addSelect('td.updated_at', 'updated_at')
      .addSelect('td.deleted_at', 'deleted_at')
      .addSelect('td.training_details_id', 'training_details_id')
      .addSelect('td.training_source_id_fk', 'training_source_id_fk')
      .addSelect('td.training_type_id_fk', 'training_type_id_fk')
      .addSelect('td.course_title', 'course_title')
      .addSelect('td.location', 'location')
      .addSelect('td.training_start', 'training_start')
      .addSelect('td.training_end', 'training_end')
      .addSelect('td.number_of_hours', 'number_of_hours')
      .addSelect('td.course_content', 'course_content')
      .addSelect('td.deadline_for_submission', 'deadline_for_submission')
      .addSelect('td.invitation_url', 'invitation_url')
      .addSelect('td.number_of_participants', 'number_of_participants')
      .addSelect('td.post_training_requirements', 'post_training_requirements')
      .addSelect('td.status', 'status')
      .addSelect('coalesce(get_lsp(tli.lsp_individual_details_id_fk), get_lsp(tlo.lsp_organization_details_id_fk)) as lsp')
      .addSelect('tt.training_tag_id', 'training_tag_id')
      .addSelect('tdi.training_distribution_id', 'training_distribution_id')
      .addSelect('tdi.no_of_slots', 'no_of_slots')
      .addSelect('tre.employee_id_fk')
      .from(TrainingDetails, 'td')
      .leftJoin(TrainingLspIndividual, 'tli', 'td.training_details_id = tli.training_details_id_fk')
      .leftJoin(TrainingLspOrganization, 'tlo', 'td.training_details_id = tlo.training_details_id_fk')
      .leftJoin(TrainingTag, 'tt', 'td.training_details_id = tt.training_details_id_fk')
      .leftJoin(TrainingDistribution, 'tdi', 'td.training_details_id = tdi.training_details_id_fk')
      .leftJoin(TrainingRecommendedEmployee, 'tre', 'tdi.training_distribution_id = tre.training_distribution_id_fk'),
})
export class TrainingDetailsTestView {
  @ViewColumn({ name: 'created_at' })
  createdAt: string;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: string;

  @ViewColumn({ name: 'deleted_at' })
  deletedAt: string;

  @ViewColumn({ name: 'training_details_id' })
  id: string;

  @ViewColumn({ name: 'training_source_id_fk' })
  trainingSource: string;

  @ViewColumn({ name: 'training_type_id_fk' })
  trainingType: string;

  @ViewColumn({ name: 'course_title' })
  courseTitle: string;

  @ViewColumn({ name: 'location' })
  location: string;

  @ViewColumn({ name: 'training_start' })
  trainingStart: Date;

  @ViewColumn({ name: 'training_end' })
  trainingEnd: Date;

  @ViewColumn({ name: 'number_of_hours' })
  numberOfHours: number;

  @ViewColumn({ name: 'course_content' })
  courseContent: string;

  @ViewColumn({ name: 'deadline_for_submission' })
  deadlineForSubmission: Date;

  @ViewColumn({ name: 'invitation_url' })
  invitationUrl: string;

  @ViewColumn({ name: 'number_of_participants' })
  numberOfParticipants: number;

  @ViewColumn({ name: 'post_training_requirements' })
  postTrainingRequirements: string;

  @ViewColumn({ name: 'status' })
  status: string;

  @ViewColumn({ name: 'lsp' })
  lspType: string;

  @ViewColumn({ name: 'training_tag_id' })
  trainingTag: string;

  @ViewColumn({ name: 'training_distribution_id' })
  trainingDistribution: string;

  @ViewColumn({ name: 'no_of_slots' })
  numberOfSlots: string;

  @ViewColumn({ name: 'employee_id_fk' })
  trainingRecommendedEmployee: string;
}
