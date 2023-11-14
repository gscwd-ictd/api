import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_logs' })
export class UserLogs extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_log_id' })
  id: string;

  @Column({ name: 'user_id_fk' })
  userId: string;

  @Column()
  route: string;

  @Column()
  method: string;

  @Column({ type: 'text', default: null })
  body: string;
}
