import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { AccountGroup } from '@gscwd-api/models';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'major_account_groups' })
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
