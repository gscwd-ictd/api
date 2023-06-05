import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CustomGroups } from '../custom-groups';

@Entity({ name: 'custom_group_members' })
export class CustomGroupMembers extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'custom_group_members_id' })
  id: string;

  @JoinColumn({ name: 'custom_group_id_fk' })
  @ManyToOne(() => CustomGroups, (customGroup) => customGroup.id)
  customGroupId: CustomGroups;

  @Column({ name: 'employee_id_fk' })
  employeeId: string;
}
