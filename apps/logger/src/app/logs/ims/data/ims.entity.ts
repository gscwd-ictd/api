import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IEntity } from '@gscwd-api/crud';

@Entity('ims_logs')
export class ImsLogs implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ims_log_id' })
  id: string;

  @Column()
  host: string;

  @Column()
  url: string;

  @Column()
  method: string;

  @Column()
  headers: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
