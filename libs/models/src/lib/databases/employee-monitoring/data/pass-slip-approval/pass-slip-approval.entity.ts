import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { PassSlipApprovalStatus } from '@gscwd-api/utils';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PassSlip } from '../pass-slip/pass-slip.entity';

@Entity('pass_slip_approval')
export class PassSlipApproval extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'pass_slip_approval_id' })
  id: string;

  @JoinColumn({ name: 'pass_slip_id_fk' })
  @ManyToOne(() => PassSlip, (passSlip) => passSlip.id)
  passSlipId: PassSlip;

  @Column({ name: 'supervisor_id_fk' })
  supervisorId: string;

  @Column({ name: 'supervisor_approval_date', nullable: true, default: null })
  supervisorApprovalDate: Date;

  @Column({ name: 'hrmo_approval_date', nullable: true, default: null })
  hrmoApprovalDate: Date;

  @Column({ name: 'status', type: 'enum', enum: PassSlipApprovalStatus })
  status: PassSlipApprovalStatus;
}
