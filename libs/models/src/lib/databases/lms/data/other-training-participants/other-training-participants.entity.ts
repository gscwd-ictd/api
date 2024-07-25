import { DatabaseEntityWithTimezone, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { OtherTraining } from '../other-trainings';

@Entity({ name: 'other_training_participants' })
@Unique(['otherTraining', 'employeeId'])
export class OtherTrainingParticipant extends DatabaseEntityWithTimezone implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'other_training_participant_id' })
  id: string;

  @ManyToOne(() => OtherTraining, (otherTraining) => otherTraining.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'other_training_id_fk' })
  otherTraining: OtherTraining;

  @Column({ name: 'employee_id_fk', type: 'varchar', nullable: false })
  employeeId: string;
}
