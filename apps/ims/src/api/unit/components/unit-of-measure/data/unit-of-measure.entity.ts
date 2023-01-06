import { DatabaseEntity, IEntity } from '@gscwd-api/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UnitType } from '../../unit-type';

@Entity('units_of_measure')
export class UnitOfMeasure extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'unit_of_measure_id' })
  id: string;

  @ManyToOne(() => UnitType, (unitType) => unitType.id)
  @JoinColumn({ name: 'unit_type_id_fk' })
  unitType: UnitType;

  @Column({ length: 20, unique: true })
  name: string;

  @Column({ length: 10, unique: true })
  symbol: string;
}
