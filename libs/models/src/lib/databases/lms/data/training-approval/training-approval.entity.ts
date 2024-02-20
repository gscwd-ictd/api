import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainingDetails } from '../training-details/training-details.entity';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { GeneralManagerStatus, PdcChairmanStatus, PdcSecretaryStatus } from '@gscwd-api/utils';

@Entity({ name: 'training_approvals' })
export class TrainingApproval extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_approval_id' })
  id: string;

  @OneToOne(() => TrainingDetails, (trainingDetails) => trainingDetails.id, { nullable: false })
  @JoinColumn({ name: 'training_details_id_fk' })
  trainingDetails: TrainingDetails;

  @Column({ name: 'pdc_secretary_id_fk', nullable: true, default: null })
  pdcSecretary: string;

  @Column({ name: 'pdc_secretary_approval_date', nullable: true, default: null })
  pdcSecretaryApprovalDate: Date;

  @Column({ name: 'secretary_status', type: 'enum', enum: PdcSecretaryStatus, nullable: true })
  pdcSecretaryStatus: PdcSecretaryStatus;

  @Column({ name: 'pdc_chairman_id_fk', nullable: true, default: null })
  pdcChairman: string;

  @Column({ name: 'pdc_chairman_approval_date', nullable: true, default: null })
  pdcChairmanApprovalDate: Date;

  @Column({ name: 'chairman_status', type: 'enum', enum: PdcChairmanStatus, nullable: true })
  pdcChairmanStatus: PdcChairmanStatus;

  @Column({ name: 'general_manager_id_fk', nullable: true, default: null })
  generalManager: string;

  @Column({ name: 'general_manager_approval_date', nullable: true, default: null })
  generalManagerApprovalDate: Date;

  @Column({ name: 'general_manager_status', type: 'enum', enum: GeneralManagerStatus, nullable: true })
  generalManagerStatus: GeneralManagerStatus;
}
