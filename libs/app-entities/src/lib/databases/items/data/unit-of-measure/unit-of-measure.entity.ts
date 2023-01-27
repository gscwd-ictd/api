import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('units_of_measure')
export class UnitOfMeasure extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'unit_id' })
  id: string;

  @Column({ length: 20, unique: true })
  name: string;

  @Column({ length: 10, unique: true })
  symbol: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
