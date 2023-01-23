import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('unit_types')
export class UnitType extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'unit_type_id' })
  id: string;

  @Column({ unique: true })
  type: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
