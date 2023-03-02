import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum Vatable {
  VAT = 'Vat',
  NON_VAT = 'Non-Vat',
}

@Entity('supplier')
export class Supplier extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'supplier_id' })
  id: string;

  @Column({ type: 'text', unique: true, nullable: false })
  supplier_name: string;

  @Column({ type: 'text', nullable: false })
  supplier_address: string;

  @Column({ type: 'text', nullable: false })
  cellphone_number: string;

  @Column({ type: 'text' })
  telephone_number: string;

  @Column({ type: 'text' })
  email_address: string;

  @Column({ type: 'text', unique: true })
  TIN_no: string;

  @Column({ type: 'text' })
  remarks: string;

  @Column({ type: 'enum', enum: Vatable, default: Vatable.VAT })
  status: Vatable;
}
