import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BenchmarkParticipants } from '../benchmark-participants';

@Entity({ name: 'benchmark_participant_requirements' })
export class BenchmarkParticipantRequirements extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'benchmark_participant_requirement_id' })
  id: string;

  @OneToOne(() => BenchmarkParticipants, (benchmarkParticipants) => benchmarkParticipants.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'benchmark_participants_id_fk' })
  benchmarkParticipants: BenchmarkParticipants;

  @Column({ name: 'learning_application_plan', type: 'boolean', default: false })
  learningApplicationPlan: boolean;
}
