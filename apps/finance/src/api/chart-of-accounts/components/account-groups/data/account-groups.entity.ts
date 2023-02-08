import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'account_group' })
export class AccountGroup extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'account_group_id' })
  id: string;

  @Column({ unique: true, length: 2 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
