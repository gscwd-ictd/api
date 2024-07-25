import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Benchmark } from '../benchmark/benchmark.entity';
import { DatabaseEntityWithTimezone, IEntity } from '@gscwd-api/crud';

@Entity({ name: 'benchmark_participants' })
@Unique(['benchmark', 'employeeId'])
export class BenchmarkParticipants extends DatabaseEntityWithTimezone implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'benchmark_participant_id' })
  id: string;

  @ManyToOne(() => Benchmark, (benchmark) => benchmark.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'benchmark_id_fk' })
  benchmark: Benchmark;

  @Column({ name: 'employee_id_fk', type: 'varchar', nullable: false })
  employeeId: string;
}
