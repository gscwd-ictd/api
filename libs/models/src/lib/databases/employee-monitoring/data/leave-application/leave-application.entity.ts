import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { LeaveBenefits } from '../leave-benefits/leave-benefits.entity';
import { LeaveApplicationStatus } from '@gscwd-api/utils';

@Entity('leave_application')
export class LeaveApplication extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'leave_application_id' })
  id: string;

  @Column({ name: 'employee_id_fk', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'supervisor_id_fk', type: 'uuid' })
  supervisorId: string;

  @JoinColumn({ name: 'leave_benefits_id_fk' })
  @ManyToOne(() => LeaveBenefits, (leaveBenefits) => leaveBenefits.id)
  leaveBenefitsId: LeaveBenefits;

  @Column({ name: 'date_of_filing', type: 'datetime' })
  dateOfFiling: Date;

  @Column({ name: 'in_philippines', nullable: true })
  inPhilippines: string;

  @Column({ name: 'abroad', nullable: true })
  abroad: string;

  @Column({ name: 'in_hospital', nullable: true })
  inHospital: string;

  @Column({ name: 'out_patient', nullable: true })
  outPatient: string;

  @Column({ name: 'spl_women', nullable: true })
  splWomen: string;

  @Column({ name: 'for_masters_completion', type: 'bool', nullable: true })
  forMastersCompletion: boolean;

  @Column({ name: 'for_bar_board_review', type: 'bool', nullable: true })
  forBarBoardReview: boolean;

  @Column({ name: 'study_leave_other', nullable: true })
  studyLeaveOther: string;

  @Column({ name: 'for_monetization', type: 'bool' })
  forMonetization: boolean;

  @Column({ name: 'is_terminal_leave', type: 'bool', nullable: true })
  isTerminalLeave: boolean;

  @Column({ name: 'requested_commutation', type: 'bool', nullable: true })
  requestedCommutation: boolean;

  @Column({ type: 'enum', enum: LeaveApplicationStatus, default: LeaveApplicationStatus.FOR_HRMO_APPROVAL, nullable: true })
  status: LeaveApplicationStatus;

  @Column({ type: 'text', name: 'cancel_reason', nullable: true })
  cancelReason: string;

  @Column({ type: 'datetime', name: 'cancel_date', nullable: true })
  cancelDate: Date;

  @Column({ type: 'datetime', name: 'hrmo_approval_date', nullable: true })
  hrmoApprovalDate: Date;

  @Column({ type: 'datetime', name: 'supervisor_approval_date', nullable: true })
  supervisorApprovalDate: Date;

  @Column({ type: 'text', name: 'supervisor_disapproval_remarks', nullable: true })
  supervisorDisapprovalRemarks: string;

  @Column({ type: 'datetime', name: 'hrdm_approval_date', nullable: true })
  hrdmApprovalDate: Date;

  @Column({ type: 'text', name: 'hrdm_disapproval_remarks', nullable: true })
  hrdmDisapprovalRemarks: string;

  @Column({ type: 'boolean', name: 'is_late_filing', nullable: true })
  isLateFiling: boolean;
}
