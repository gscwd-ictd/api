import { DatabaseEntityWithTimezone, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BenchmarkParticipants } from '../benchmark-participants';

@Entity({ name: 'benchmark_participant_requirements' })
export class BenchmarkParticipantRequirements extends DatabaseEntityWithTimezone implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'benchmark_participant_requirement_id' })
  id: string;

  @OneToOne(() => BenchmarkParticipants, (benchmarkParticipants) => benchmarkParticipants.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'benchmark_participants_id_fk' })
  benchmarkParticipants: BenchmarkParticipants;

  @Column({ name: 'learners_journal', type: 'boolean', default: false })
  learnersJournal: boolean;
}
