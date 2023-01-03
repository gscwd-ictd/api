import { DatabaseEntity, IEntity } from '@gscwd-api/entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('unit_of_measurement')
export class MeasurementUnit extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'unit_id' })
  id: string;

  @Column({ name: 'unit_name', unique: true, length: 10 })
  name: string;

  @Column({ name: 'unit_code', unique: true, length: 5 })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
