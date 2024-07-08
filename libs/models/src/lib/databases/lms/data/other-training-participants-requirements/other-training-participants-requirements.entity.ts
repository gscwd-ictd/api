import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { OtherTrainingParticipant } from '../other-training-participants/other-training-participants.entity';

@Entity({ name: 'other_training_participants_requirements' })
@Unique(['otherTrainingParticipant'])
export class OtherTrainingParticipantRequirements extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'other_training_participant_requirement_id' })
  id: string;

  @OneToOne(() => OtherTrainingParticipant, (otherTrainingParticipant) => otherTrainingParticipant.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'other_training_participant_id_fk' })
  otherTrainingParticipant: OtherTrainingParticipant;

  @Column({ name: 'training_requirements', type: 'jsonb', nullable: true })
  trainingRequirements: string;
}
