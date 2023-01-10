import { DatabaseEntity, IEntity } from '@gscwd-api/entities';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('test_entity')
export class TestEntity extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'test_id' })
  id: string;

  @Column()
  name: string;
}
