import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'benchmark' })
export class Benchmark extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'benchmark_id' })
  id: string;

  @Column({ name: 'title', type: 'varchar', length: '300', nullable: false })
  title: string;

  @Column({ name: 'partner', type: 'varchar', length: '250', nullable: false })
  partner: string;

  @Column({ name: 'date_started', type: 'date', nullable: false })
  dateStarted: Date;

  @Column({ name: 'date_end', type: 'date', nullable: false })
  dateEnd: Date;

  @Column({ name: 'location', type: 'varchar', length: 500, nullable: true })
  location: string;
}
