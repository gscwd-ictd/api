import { IEntity } from '@gscwd-api/crud';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'account_group' })
export class AccountGroup extends BaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'account_group_id' })
  id: string;

  @Column({ unique: true, length: 2 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
