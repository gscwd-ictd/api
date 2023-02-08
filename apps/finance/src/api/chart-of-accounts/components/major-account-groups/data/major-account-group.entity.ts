import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { AccountGroup } from '../../account-groups';

@Entity({ name: 'major_account_group' })
@Unique(['accountGroup', 'code'])
export class MajorAccountGroup extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'major_account_group_id' })
  id: string;

  @ManyToOne(() => AccountGroup, (accountGroup) => accountGroup.id, { nullable: false })
  @JoinColumn({ name: 'account_group_id_fk' })
  accountGroup: AccountGroup;

  @Column({ length: 2 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
