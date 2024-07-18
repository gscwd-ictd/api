import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainingDetails } from '../training-details/training-details.entity';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';

@Entity({ name: 'training_approvals' })
export class TrainingApproval extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_approval_id' })
  id: string;

  @OneToOne(() => TrainingDetails, (trainingDetails) => trainingDetails.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'training_details_id_fk' })
  trainingDetails: TrainingDetails;

  @Column({ name: 'tdd_manager_id_fk', nullable: true, default: null })
  tddManager: string;

  @Column({ name: 'tdd_manager_approval_date', nullable: true, default: null })
  tddManagerApprovalDate: Date;

  @Column({ name: 'pdc_secretariat_id_fk', nullable: true, default: null })
  pdcSecretariat: string;

  @Column({ name: 'pdc_secretariat_approval_date', nullable: true, default: null })
  pdcSecretariatApprovalDate: Date;

  @Column({ name: 'pdc_chairman_id_fk', nullable: true, default: null })
  pdcChairman: string;

  @Column({ name: 'pdc_chairman_approval_date', nullable: true, default: null })
  pdcChairmanApprovalDate: Date;

  @Column({ name: 'general_manager_id_fk', nullable: true, default: null })
  generalManager: string;

  @Column({ name: 'general_manager_approval_date', nullable: true, default: null })
  generalManagerApprovalDate: Date;

  @Column({ name: 'remarks', length: 200, nullable: true })
  remarks: string;
}
