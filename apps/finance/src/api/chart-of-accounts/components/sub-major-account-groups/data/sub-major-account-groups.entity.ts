import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { MajorAccountGroup } from '../../major-account-groups';

@Entity({ name: 'sub_major_accounts' })
@Unique(['majorAccountGroup', 'code'])
export class SubMajorAccountGroup extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'sub_major_account_group_id' })
  id: string;

  @ManyToOne(() => MajorAccountGroup, (majorAccountGroup) => majorAccountGroup.id, { nullable: false })
  @JoinColumn({ name: 'major_account_group_id_fk' })
  majorAccountGroup: MajorAccountGroup;

  @Column({ length: 2 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
