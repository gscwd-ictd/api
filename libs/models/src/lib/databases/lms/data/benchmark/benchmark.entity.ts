import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { BenchmarkStatus } from '@gscwd-api/utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'benchmark' })
export class Benchmark extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'benchmark_id' })
  id: string;

  @Column({ name: 'title', type: 'varchar', length: '300', nullable: false })
  title: string;

  @Column({ name: 'partner', type: 'varchar', length: '250', nullable: false })
  partner: string;

  @Column({ name: 'date_from', type: 'date', nullable: false })
  dateFrom: Date;

  @Column({ name: 'date_to', type: 'date', nullable: false })
  dateTo: Date;

  @Column({ name: 'location', type: 'varchar', length: 500, nullable: true })
  location: string;

  @Column({ name: 'status', type: 'enum', enum: BenchmarkStatus, default: BenchmarkStatus.PENDING })
  status: BenchmarkStatus;
}
