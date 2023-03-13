import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('suppliers')
export class Supplier extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'supplier_id' })
  id: string;

  @Column({ name: 'supplier_name', unique: true, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ name: 'mobile_number', type: 'text', nullable: false })
  mobileNumber: string;

  @Column({ name: 'telephone_number', type: 'text' })
  telNumber: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text', unique: true })
  tin: string;

  @Column({ type: 'text' })
  remarks: string;

  @Column({ type: 'boolean', default: true })
  isVatable: boolean;
}
