import { IEntity } from '@gscwd-api/crud';
import { AfterInsert, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('atteninfo')
export class IvmsDailyTimeRecord implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'dtr_id' })
  _id: string;

  @Column({ name: 'ID', type: 'varchar', length: 50 })
  id: string;

  @Column({ name: 'date', type: 'date' })
  date: Date;

  @Column({ name: 'datetime', type: 'datetime' })
  dateTime: Date;

  @Column({ name: 'time', type: 'time', nullable: true })
  time: string;

  @Column({ name: 'status', type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({ name: 'device', type: 'varchar', length: 255, nullable: true })
  device: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deviceno: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  empname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cardno: string;
}
